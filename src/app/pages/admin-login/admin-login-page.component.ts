import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(203,213,225,0.38),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f6f7f8_55%,#eef1f4_100%)]"></div>
      <div class="relative mx-auto grid max-w-6xl items-stretch gap-10 lg:grid-cols-[0.88fr_1.12fr]">
        <div class="flex flex-col justify-between rounded-[2.25rem] border border-[#2a2a2a] bg-[#111111] p-10 shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
          <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#c0c7d0]">Admin Access</p>
          <div class="mt-6">
            <h1 class="max-w-md font-display text-5xl leading-[0.98] text-white md:text-[4.7rem]">Enter the Caliber command center</h1>
            <p class="mt-6 max-w-lg text-lg leading-9 text-[#d1d5db]">
              Sign in with an approved administrator account to manage watches, orders, users, analytics, and store settings.
            </p>
          </div>
          <div class="mt-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#c0c7d0]">Authorized Admin</p>
            <p class="mt-3 break-all leading-8 text-white">dhruvilkyada483&#64;gmail.com</p>
          </div>
        </div>

        <div class="rounded-[2.25rem] border border-[#d8dde3] bg-white p-10 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
          <div class="mx-auto max-w-xl">
            <form class="grid gap-5" (ngSubmit)="login()">
              <label class="text-xs font-semibold uppercase tracking-[0.32em] text-[#6b7280]">Admin Email</label>
              <input [(ngModel)]="form.email" name="email" type="email" placeholder="dhruvilkyada483@gmail.com" class="rounded-[1.1rem] border border-[#d8dde3] bg-[#f8fafc] px-5 py-4 text-[#111111] outline-none placeholder:text-[#9ca3af]" required>
              <label class="mt-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#6b7280]">Password</label>
              <input [(ngModel)]="form.password" name="password" type="password" placeholder="Enter password" class="rounded-[1.1rem] border border-[#d8dde3] bg-[#f8fafc] px-5 py-4 text-[#111111] outline-none placeholder:text-[#9ca3af]" required>

              @if (error) {
                <div class="rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-sm text-[#6b7280]">
                  {{ error }}
                </div>
              }

              <button type="submit" class="mt-4 rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#303030]">
                Sign In To Admin
              </button>
            </form>

            <p class="mt-8 text-sm text-[#6b7280]">
              Need regular access?
              <a routerLink="/login" class="font-semibold text-[#111111]">Use client login</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminLoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = { email: '', password: '' };
  error = '';

  async login(): Promise<void> {
    await this.authService.loginWithEmail(this.form.email, this.form.password);

    if (!this.authService.isAdmin()) {
      this.error = 'This account does not have admin access.';
      return;
    }

    void this.router.navigate(['/admin']);
  }
}
