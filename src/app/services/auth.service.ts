import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc
} from '@angular/fire/firestore';
import { environment } from '../environment';
import { DashboardUser } from '../models/user.model';
import { CartService } from './cart.service';

type OtpPurpose = 'login' | 'register';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly cartService = inject(CartService);
  private readonly firestore = inject(Firestore);
  private readonly storageKey = 'caliber-auth-user';
  private readonly usersStorageKey = 'caliber-users';
  private readonly adminEmails = new Set(['dhruvilkyada483@gmail.com']);
  private readonly userState = signal<DashboardUser | null>(null);
  private readonly usersState = signal<DashboardUser[]>([]);
  private readonly usersCollection = collection(this.firestore, 'users');
  private readonly firebaseEnabled = this.isFirebaseConfigured();

  readonly user = this.userState.asReadonly();

  constructor() {
    this.restoreSession();
    if (this.firebaseEnabled) {
      this.bindUsers();
    } else {
      this.usersState.set(this.restoreUsers());
    }
  }

  isAuthenticated(): boolean {
    return !!this.userState();
  }

  isAdmin(): boolean {
    return this.userState()?.role === 'admin';
  }

  getAllUsers(): DashboardUser[] {
    return this.usersState();
  }

  getUserById(userId: string | undefined): DashboardUser | undefined {
    if (!userId) {
      return undefined;
    }

    return this.usersState().find((user) => user.id === userId);
  }

  getWishlist(): string[] {
    return this.userState()?.wishlist ?? [];
  }

  async requestEmailOtp(email: string, purpose: OtpPurpose = 'login'): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('Enter an email address to continue.');
    }

    await this.postJson('/otp/send', {
      email: normalizedEmail,
      purpose
    });
  }

  async verifyEmailOtp(email: string, otp: string, purpose: OtpPurpose = 'login'): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    await this.postJson('/otp/verify', {
      email: normalizedEmail,
      code: otp.trim(),
      purpose
    });

    if (purpose === 'login') {
      this.loginByEmail(normalizedEmail, false);
    }
  }

  async updateProfile(patch: Partial<Pick<DashboardUser, 'name' | 'phone' | 'address' | 'city'>>): Promise<void> {
    const user = this.userState();
    if (!user) {
      return;
    }

    await this.persistUser({
      ...user,
      ...patch
    });
  }

  async toggleWishlist(watchId: string): Promise<void> {
    const user = this.userState();
    if (!user) {
      return;
    }

    const wishlist = user.wishlist.includes(watchId)
      ? user.wishlist.filter((id) => id !== watchId)
      : [...user.wishlist, watchId];

    await this.persistUser({
      ...user,
      wishlist
    });
  }

  async loginWithEmail(email: string, _password: string): Promise<void> {
    await this.loginByEmail(email.trim().toLowerCase());
  }

  async register(payload: { name: string; email: string; phone: string; password?: string }): Promise<void> {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existingUser = this.usersState().find((user) => user.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    await this.persistUser({
      id: this.createUserIdFromEmail(normalizedEmail),
      name: payload.name.trim(),
      email: normalizedEmail,
      phone: payload.phone.trim(),
      address: '',
      city: '',
      role: 'user',
      wishlist: [],
      createdAt: new Date().toISOString()
    });
  }

  logout(): void {
    this.userState.set(null);
    this.cartService.clearCart();
    sessionStorage.removeItem(this.storageKey);
  }

  private bindUsers(): void {
    onSnapshot(this.usersCollection, (snapshot) => {
      const users = snapshot.docs.map((entry) => this.normalizeUser(entry.data() as DashboardUser));
      this.usersState.set(users);

      const currentUser = this.userState();
      if (!currentUser) {
        return;
      }

      const syncedUser = users.find((user) =>
        user.id === currentUser.id || user.email.toLowerCase() === currentUser.email.toLowerCase()
      );

      if (syncedUser) {
        this.applyUser(syncedUser);
      }
    }, (error) => {
      console.error('Failed to load users from Firestore:', error);
      this.usersState.set([]);
    });
  }

  private async postJson(path: string, body: object): Promise<void> {
    let response: Response;

    try {
      response = await fetch(`${environment.apiUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    } catch {
      throw new Error('Unable to reach the OTP server. Start the backend on http://localhost:5000 and try again.');
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.message || 'The request could not be completed.');
    }
  }

  private async loginByEmail(email: string, waitForPersist = true): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin = this.isAdminEmail(normalizedEmail);
    const existingUser = this.usersState().find((user) => user.email.toLowerCase() === normalizedEmail);

    const nextUser = {
      id: existingUser?.id ?? this.createUserIdFromEmail(normalizedEmail),
      name: existingUser?.name ?? this.getDisplayNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      phone: existingUser?.phone ?? '+91 9876543210',
      address: existingUser?.address ?? '',
      city: existingUser?.city ?? '',
      role: isAdmin ? 'admin' : existingUser?.role ?? 'user',
      wishlist: existingUser?.wishlist ?? ['rolex-submariner', 'omega-speedmaster'],
      createdAt: existingUser?.createdAt ?? new Date().toISOString()
    };

    if (waitForPersist) {
      await this.persistUser(nextUser);
      return;
    }

    this.applyUser(nextUser);
    void this.persistUser(nextUser);
  }

  private getDisplayNameFromEmail(email: string): string {
    const knownNames: Record<string, string> = {
      'dhruvilkyada483@gmail.com': 'Dhruvil Kyada'
    };

    if (knownNames[email]) {
      return knownNames[email];
    }

    const localPart = email.split('@')[0]?.replace(/\d+/g, '').replace(/[._-]+/g, ' ').trim();
    if (!localPart) {
      return 'Client';
    }

    return localPart
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private isAdminEmail(email: string): boolean {
    return email.includes('admin') || this.adminEmails.has(email);
  }

  private applyUser(user: DashboardUser): void {
    const normalizedUser = this.normalizeUser(user);
    this.userState.set(normalizedUser);
    sessionStorage.setItem(this.storageKey, JSON.stringify(normalizedUser));
  }

  private restoreSession(): void {
    try {
      const rawUser = sessionStorage.getItem(this.storageKey);
      if (!rawUser) {
        localStorage.removeItem(this.storageKey);
        return;
      }

      const parsedUser = JSON.parse(rawUser) as DashboardUser;
      if (!parsedUser?.email) {
        sessionStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.storageKey);
        return;
      }

      this.applyUser(parsedUser);
    } catch {
      sessionStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.storageKey);
    }
  }

  private async persistUser(user: DashboardUser): Promise<void> {
    const normalizedUser = this.normalizeUser(user);
    this.applyUser(normalizedUser);

    if (!this.firebaseEnabled) {
      this.usersState.update((users) => {
        const existingIndex = users.findIndex((entry) =>
          entry.id === normalizedUser.id || entry.email.toLowerCase() === normalizedUser.email.toLowerCase()
        );

        if (existingIndex === -1) {
          const nextUsers = [normalizedUser, ...users];
          this.persistUsers(nextUsers);
          return nextUsers;
        }

        const nextUsers = [...users];
        nextUsers[existingIndex] = {
          ...nextUsers[existingIndex],
          ...normalizedUser
        };
        this.persistUsers(nextUsers);
        return nextUsers;
      });
      return;
    }

    await setDoc(doc(this.firestore, 'users', normalizedUser.id), normalizedUser, { merge: true });
  }

  private normalizeUser(user: DashboardUser): DashboardUser {
    return {
      ...user,
      id: user.id || this.createUserIdFromEmail(user.email),
      role: this.isAdminEmail(user.email) ? 'admin' : user.role,
      wishlist: user.wishlist ?? [],
      createdAt: user.createdAt ?? new Date().toISOString()
    };
  }

  private createUserIdFromEmail(email: string): string {
    const base = email
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `user-${base || 'client'}`;
  }

  private restoreUsers(): DashboardUser[] {
    try {
      const rawUsers = localStorage.getItem(this.usersStorageKey);
      if (!rawUsers) {
        return [];
      }

      const parsedUsers = JSON.parse(rawUsers) as DashboardUser[];
      return parsedUsers
        .filter((user) => !!user?.email)
        .map((user) => this.normalizeUser(user));
    } catch {
      localStorage.removeItem(this.usersStorageKey);
      return [];
    }
  }

  private persistUsers(users: DashboardUser[]): void {
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
  }

  private isFirebaseConfigured(): boolean {
    const { apiKey, projectId, appId } = environment.firebase;
    return ![apiKey, projectId, appId].some((value) => !value || value.startsWith('YOUR_FIREBASE_'));
  }
}
