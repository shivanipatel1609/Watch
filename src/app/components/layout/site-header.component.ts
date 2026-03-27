import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { BrandLogoComponent } from '../shared/brand-logo.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BrandLogoComponent],
  template: `
    <header class="relative z-50 transition-all duration-300" [ngClass]="headerClasses()">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 lg:px-6">
        <app-brand-logo [showTagline]="false" ariaLabel="Caliber home"></app-brand-logo>

        <nav class="hidden items-center gap-10 text-[12px] font-semibold uppercase tracking-[0.32em] text-[#111111] lg:flex">
          <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="text-[#0F3D2E]" class="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#0F3D2E] after:transition-[width] after:duration-300 hover:text-[#0F3D2E] hover:after:w-full">Home</a>
          <a routerLink="/catalog" routerLinkActive="text-[#0F3D2E]" class="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#0F3D2E] after:transition-[width] after:duration-300 hover:text-[#0F3D2E] hover:after:w-full">Collection</a>
           <a routerLink="/about" routerLinkActive="text-[#0F3D2E]" class="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#0F3D2E] after:transition-[width] after:duration-300 hover:text-[#0F3D2E] hover:after:w-full">About</a>
          <a routerLink="/contact" routerLinkActive="text-[#0F3D2E]" class="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#0F3D2E] after:transition-[width] after:duration-300 hover:text-[#0F3D2E] hover:after:w-full">Contact</a>
        </nav>

        <div class="hidden items-center gap-5 lg:flex">
          @if (isAuthenticated()) {
            <a routerLink="/wishlist" class="flex h-14 w-14 items-center justify-center rounded-full border border-[#E7E7E7] bg-white text-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.04)] hover:border-[#0F3D2E] hover:text-[#0F3D2E]" aria-label="Wishlist">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 20-1.1-1C5.2 13.9 2 11 2 7.5 2 4.4 4.4 2 7.5 2c1.7 0 3.4.8 4.5 2.1C13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.4 22 7.5c0 3.5-3.2 6.4-8.9 11.5L12 20Z"></path>
              </svg>
            </a>
          }

          <a routerLink="/cart" class="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#E7E7E7] bg-white text-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.04)] hover:border-[#0F3D2E] hover:text-[#0F3D2E]" aria-label="Cart">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 7h12l-1 11H7L6 7Z"></path>
              <path d="M9 7a3 3 0 1 1 6 0"></path>
            </svg>
            @if (itemCount()) {
              <span class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F3D2E] px-1 text-[10px] font-semibold text-white">
                {{ itemCount() }}
              </span>
            }
          </a>

          @if (isAuthenticated()) {
            <a routerLink="/profile" class="rounded-full border border-[#E7E7E7] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
              Account
            </a>
            <button type="button" (click)="logout()" class="rounded-full bg-[#0F3D2E] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_35px_rgba(15,61,46,0.16)] hover:bg-[#1F7A63]">
              Logout
            </button>
          } @else {
            <a routerLink="/login" class="rounded-full border border-[#0F3D2E] px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white">
              Sign In
            </a>
          }
        </div>

        <button type="button" (click)="toggleMenu()" class="flex h-12 w-12 items-center justify-center rounded-full border border-[#E7E7E7] bg-white text-[#111111] lg:hidden" aria-label="Toggle navigation menu">
          @if (!menuOpen()) {
            <span class="space-y-1.5">
              <span class="block h-0.5 w-5 bg-current"></span>
              <span class="block h-0.5 w-5 bg-current"></span>
              <span class="block h-0.5 w-5 bg-current"></span>
            </span>
          } @else {
            <span class="text-xl leading-none">&times;</span>
          }
        </button>
      </div>

      @if (menuOpen()) {
        <div class="border-t border-[#E5E5E5] bg-white px-5 py-5 shadow-[0_20px_40px_rgba(17,17,17,0.05)] backdrop-blur-xl lg:hidden">
          <nav class="grid gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#111111]">
            <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="text-[#0F3D2E]" (click)="closeMenu()" class="rounded-2xl px-4 py-3 hover:bg-[#F9F9F9]">Home</a>
            <a routerLink="/catalog" routerLinkActive="text-[#0F3D2E]" (click)="closeMenu()" class="rounded-2xl px-4 py-3 hover:bg-[#F9F9F9]">Collection</a>
            <a routerLink="/about" routerLinkActive="text-[#0F3D2E]" (click)="closeMenu()" class="rounded-2xl px-4 py-3 hover:bg-[#F9F9F9]">About</a>
            <a routerLink="/contact" routerLinkActive="text-[#0F3D2E]" (click)="closeMenu()" class="rounded-2xl px-4 py-3 hover:bg-[#F9F9F9]">Contact</a>
            @if (isAuthenticated()) {
              <a routerLink="/dashboard" (click)="closeMenu()" class="rounded-2xl px-4 py-3 hover:bg-[#F9F9F9]">Account</a>
              <a routerLink="/wishlist" (click)="closeMenu()" class="rounded-2xl px-4 py-3 hover:bg-[#F9F9F9]">
                Wishlist {{ wishlistCount() ? '(' + wishlistCount() + ')' : '' }}
              </a>
            }
            <a routerLink="/cart" routerLinkActive="text-[#0F3D2E]" (click)="closeMenu()" class="rounded-2xl px-4 py-3 hover:bg-[#F9F9F9]">
              Cart {{ itemCount() ? '(' + itemCount() + ')' : '' }}
            </a>
          </nav>

          <div class="mt-4 grid gap-3 border-t border-[#E5E5E5] pt-4">
            @if (isAuthenticated()) {
              <button type="button" (click)="logout()" class="rounded-full bg-[#0F3D2E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#1F7A63]">
                Logout
              </button>
            } @else {
              <a routerLink="/login" (click)="closeMenu()" class="rounded-full border border-[#0F3D2E] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white">
                Sign In
              </a>
            }
          </div>
        </div>
      }
    </header>
  `
})
export class SiteHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly menuOpen = signal(false);
  readonly currentUrl = signal(this.router.url);
  readonly itemCount = computed(() => this.cartService.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly wishlistCount = computed(() => this.authService.getWishlist().length);
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly headerClasses = computed(() => 'border-b border-[#EAEAEA] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.05)]');

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.closeMenu();
      });
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    void this.router.navigate(['/']);
  }
}
