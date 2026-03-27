import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AiChatbotComponent } from './components/layout/ai-chatbot.component';
import { BrandLogoComponent } from './components/shared/brand-logo.component';
import { SiteFooterComponent } from './components/layout/site-footer.component';
import { SiteHeaderComponent } from './components/layout/site-header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, SiteHeaderComponent, SiteFooterComponent, AiChatbotComponent, BrandLogoComponent],
  template: `
    @if (isAdminPanelRoute()) {
      <div class="h-screen overflow-hidden bg-[#f5f5f5] text-[#111111]">
        <div class="flex h-full">
          <aside class="hidden h-full w-72 border-r border-[#d4d4d4] bg-[#111111] px-6 py-8 text-white xl:block">
            <app-brand-logo theme="dark" size="sm" [showTagline]="false" ariaLabel="Caliber admin home"></app-brand-logo>
            <p class="mt-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#a3a3a3]">Admin Suite</p>

            <nav class="mt-10 grid gap-3 text-sm font-semibold uppercase tracking-[0.18em]">
              <a routerLink="/admin" routerLinkActive="bg-[#2a2a2a] text-white" [routerLinkActiveOptions]="{ exact: true }" class="rounded-[1rem] px-4 py-3 text-[#cfcfcf] transition hover:bg-[#1d1d1d] hover:text-white">Overview</a>
              <a routerLink="/admin/watches" routerLinkActive="bg-[#2a2a2a] text-white" class="rounded-[1rem] px-4 py-3 text-[#cfcfcf] transition hover:bg-[#1d1d1d] hover:text-white">Watches</a>
              <a routerLink="/admin/orders" routerLinkActive="bg-[#2a2a2a] text-white" class="rounded-[1rem] px-4 py-3 text-[#cfcfcf] transition hover:bg-[#1d1d1d] hover:text-white">Orders</a>
              <a routerLink="/admin/users" routerLinkActive="bg-[#2a2a2a] text-white" class="rounded-[1rem] px-4 py-3 text-[#cfcfcf] transition hover:bg-[#1d1d1d] hover:text-white">Users</a>
              <a routerLink="/admin/analytics" routerLinkActive="bg-[#2a2a2a] text-white" class="rounded-[1rem] px-4 py-3 text-[#cfcfcf] transition hover:bg-[#1d1d1d] hover:text-white">Analytics</a>
              <a routerLink="/admin/settings" routerLinkActive="bg-[#2a2a2a] text-white" class="rounded-[1rem] px-4 py-3 text-[#cfcfcf] transition hover:bg-[#1d1d1d] hover:text-white">Settings</a>
            </nav>

            <div class="mt-10 rounded-[1.5rem] border border-white/10 bg-[#181818] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f8f8f]">Administrator</p>
              <p class="mt-3 text-lg text-white">{{ adminName() }}</p>
              <p class="mt-1 text-sm text-[#cfcfcf]">{{ adminEmail() }}</p>
            </div>

            <button type="button" (click)="logout()" class="mt-8 w-full rounded-full border border-[#3a3a3a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white hover:bg-white hover:text-[#111111]">
              Logout
            </button>
          </aside>

          <div class="flex h-full min-w-0 flex-1 flex-col">
            <header class="shrink-0 border-b border-[#d4d4d4] bg-[#fafafa]/95 px-6 py-5 backdrop-blur-xl">
              <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#6b6b6b]">Caliber Admin</p>
                  <p class="mt-2 text-2xl font-display text-[#111111]">Store management workspace</p>
                </div>
                <div class="flex items-center gap-3">
                  <a routerLink="/" class="rounded-full border border-[#d4d4d4] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#111111] hover:border-[#111111]">
                    View Store
                  </a>
                  <button type="button" (click)="logout()" class="rounded-full bg-[#111111] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#2d2d2d] xl:hidden">
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <main class="min-h-0 flex-1 overflow-y-auto">
              <router-outlet></router-outlet>
            </main>
          </div>
        </div>
      </div>
    } @else if (isAdminLoginRoute()) {
      <div class="min-h-screen bg-ivory text-graphite">
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
    } @else {
      <div class="min-h-screen bg-ivory text-graphite">
        <app-site-header></app-site-header>
        <main>
          <router-outlet></router-outlet>
        </main>
        <app-site-footer></app-site-footer>
        <app-ai-chatbot></app-ai-chatbot>
      </div>
    }
  `
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly currentUrl = signal(this.router.url);
  readonly adminName = signal(this.authService.user()?.name ?? 'Admin');
  readonly adminEmail = signal(this.authService.user()?.email ?? 'admin@caliber.store');

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.adminName.set(this.authService.user()?.name ?? 'Admin');
        this.adminEmail.set(this.authService.user()?.email ?? 'admin@caliber.store');
      });
  }

  isAdminPanelRoute(): boolean {
    return this.currentUrl().startsWith('/admin') && !this.currentUrl().startsWith('/admin/login');
  }

  isAdminLoginRoute(): boolean {
    return this.currentUrl().startsWith('/admin/login');
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/admin/login']);
  }
}
