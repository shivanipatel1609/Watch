import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch
} from '@angular/fire/firestore';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadString
} from '@angular/fire/storage';
import { WATCHES } from '../data/watch.data';
import { Watch } from '../models/watch.model';

@Injectable({ providedIn: 'root' })
export class WatchService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly watchesCollection = collection(this.firestore, 'watches');
  private readonly watchesState = signal<Watch[]>(WATCHES);

  readonly watches = this.watchesState.asReadonly();

  constructor() {
    this.bindWatches();
    void this.seedCatalogIfEmpty();
  }

  getFeatured(): Watch[] {
    return this.watchesState().filter((watch) => watch.featured);
  }

  getBrands(): string[] {
    return [...new Set(this.watchesState().map((watch) => watch.brand))];
  }

  getById(id: string | null): Watch | undefined {
    return this.watchesState().find((watch) => watch.id === id);
  }

  search(term: string): Watch[] {
    const normalized = term.trim().toLowerCase();
    if (!normalized) {
      return this.watchesState();
    }

    return this.watchesState().filter((watch) =>
      `${watch.brand} ${watch.name} ${watch.category}`.toLowerCase().includes(normalized)
    );
  }

  async addWatch(payload: Omit<Watch, 'id'> & { id?: string }): Promise<void> {
    const watch = this.normalizeWatch(payload);
    await setDoc(doc(this.firestore, 'watches', watch.id), watch);
  }

  async updateWatch(id: string, patch: Partial<Watch>): Promise<void> {
    const current = this.getById(id);
    if (!current) {
      return;
    }

    const nextWatch = this.normalizeWatch({
      ...current,
      ...patch,
      id
    });

    await updateDoc(doc(this.firestore, 'watches', id), { ...nextWatch });
  }

  async deleteWatch(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'watches', id));
  }

  async uploadWatchImage(imageDataUrl: string, watchName: string): Promise<string> {
    if (!imageDataUrl.startsWith('data:')) {
      return imageDataUrl;
    }

    const fileName = watchName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `watch-${Date.now()}`;

    const imageRef = ref(this.storage, `watches/${fileName}-${Date.now()}.jpg`);
    await uploadString(imageRef, imageDataUrl, 'data_url');
    return getDownloadURL(imageRef);
  }

  private bindWatches(): void {
    onSnapshot(this.watchesCollection, (snapshot) => {
      const watches = snapshot.docs.map((entry) => this.normalizeWatch(entry.data() as Watch));
      this.watchesState.set(watches.length ? this.sortWatches(watches) : WATCHES);
    }, (error) => {
      console.error('Failed to load watches from Firestore:', error);
      this.watchesState.set(WATCHES);
    });
  }

  private async seedCatalogIfEmpty(): Promise<void> {
    const snapshot = await getDocs(this.watchesCollection);
    if (!snapshot.empty) {
      return;
    }

    const batch = writeBatch(this.firestore);
    for (const watch of WATCHES) {
      batch.set(doc(this.firestore, 'watches', watch.id), this.normalizeWatch(watch));
    }
    await batch.commit();
  }

  private normalizeWatch(payload: Omit<Watch, 'id'> & { id?: string }): Watch {
    const normalizedName = payload.name.trim();
    const generatedId = normalizedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return {
      ...payload,
      id: payload.id?.trim() || generatedId || `watch-${Date.now()}`,
      name: normalizedName,
      brand: payload.brand.trim(),
      description: payload.description.trim(),
      category: payload.category.trim().toLowerCase(),
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      rating: Number(payload.rating) || 0,
      accent: payload.accent?.trim() || 'from-[#2f3a4a] to-[#c8a46b]',
      images: payload.images.length ? payload.images : ['assets/images/watches/Rolex Submariner Pro/r1.png'],
      specifications: payload.specifications.length
        ? payload.specifications
        : [
            { label: 'Movement', value: 'Automatic' },
            { label: 'Case', value: '42mm' },
            { label: 'Category', value: payload.category.trim() || 'Luxury' },
            { label: 'Power / Battery', value: '70 hours' }
          ],
      reviews: payload.reviews.length
        ? payload.reviews
        : [
            {
              author: 'Caliber Editorial',
              rating: Number(payload.rating) || 5,
              comment: `${normalizedName} is now available in the Caliber collection.`
            }
          ],
      featured: !!payload.featured
    };
  }

  private sortWatches(watches: Watch[]): Watch[] {
    return [...watches].sort((left, right) => left.name.localeCompare(right.name));
  }
}
