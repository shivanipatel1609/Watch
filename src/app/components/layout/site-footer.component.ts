import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogoComponent } from '../shared/brand-logo.component';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink, BrandLogoComponent],
  template: `
    <footer class="bg-[#0F3D2E] text-white">
      <div class="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <app-brand-logo theme="dark" size="sm" ariaLabel="Caliber home"></app-brand-logo>
          <p class="mt-5 max-w-sm text-sm leading-7 text-white/74">
            Precision, heritage, and contemporary restraint. Caliber presents luxury timepieces with boutique-level service and a timeless design language.
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Navigation</p>
          <a routerLink="/" class="mt-5 block text-sm text-white/78 hover:text-white">Home</a>
          <a routerLink="/catalog" class="mt-3 block text-sm text-white/78 hover:text-white">Collection</a>
          <a routerLink="/about" class="mt-3 block text-sm text-white/78 hover:text-white">About</a>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Services</p>
          <a routerLink="/shipping" class="mt-5 block text-sm text-white/78 hover:text-white">Shipping</a>
          <a routerLink="/faq" class="mt-3 block text-sm text-white/78 hover:text-white">FAQ</a>
          <a routerLink="/contact" class="mt-3 block text-sm text-white/78 hover:text-white">Contact</a>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Follow</p>
          <p class="mt-5 text-sm text-white/78">caliberwatch&#64;store.com</p>
          <p class="mt-3 text-sm text-white/78">+91 63597 81054</p>
          <div class="mt-6 flex items-center gap-3">
            <a href="https://www.instagram.com/caliber_watch.store?igsh=MXBkaDBoYmdiamlmcw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm text-white/78 hover:border-white hover:bg-white hover:text-[#0F3D2E]">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"></circle>
              </svg>
            </a>
            <a href="#" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm text-white/78 hover:border-white hover:bg-white hover:text-[#0F3D2E]">in</a>
            <a href="#" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm text-white/78 hover:border-white hover:bg-white hover:text-[#0F3D2E]">x</a>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs uppercase tracking-[0.24em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>Caliber Watch Store</p>
          <p>Timeless Precision</p>
        </div>
      </div>
    </footer>
  `
})
export class SiteFooterComponent {}
