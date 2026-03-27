import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a
      routerLink="/"
      class="group inline-flex cursor-pointer items-center gap-3"
      [ngClass]="{
        'pointer-events-none': disableLink,
        'text-white': theme === 'dark',
        'text-[#111111]': theme !== 'dark'
      }"
      [attr.aria-label]="ariaLabel"
      title="Go to landing page"
    >
      <span
        class="relative flex items-center justify-center overflow-hidden rounded-[1.35rem] border shadow-[0_16px_34px_rgba(17,17,17,0.10)] transition-transform duration-300 group-hover:-translate-y-0.5"
        [ngClass]="{
          'h-11 w-11': size === 'sm',
          'h-14 w-14': size !== 'sm',
          'border-white/20 bg-[linear-gradient(160deg,#17392f_0%,#0f3d2e_58%,#1f7a63_100%)]': theme === 'dark',
          'border-[#d8ddd8] bg-[linear-gradient(160deg,#f8fbf8_0%,#edf5f1_54%,#d7ebe2_100%)]': theme !== 'dark'
        }"
      >
        <span
          class="absolute inset-[5px] rounded-[1rem] border"
          [ngClass]="{
            'border-white/14': theme === 'dark',
            'border-[#ffffff]/80': theme !== 'dark'
          }"
        ></span>
        <svg
          viewBox="0 0 64 64"
          class="relative z-10"
          [ngClass]="{
            'h-7 w-7': size === 'sm',
            'h-8 w-8': size !== 'sm'
          }"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="18.5" [attr.stroke]="theme === 'dark' ? '#F5F7F4' : '#0F3D2E'" stroke-width="2.2" />
          <circle cx="32" cy="32" r="2.8" [attr.fill]="theme === 'dark' ? '#F5F7F4' : '#0F3D2E'" />
          <path d="M32 19V15" [attr.stroke]="theme === 'dark' ? '#D5E7DE' : '#0F3D2E'" stroke-width="2" stroke-linecap="round" />
          <path d="M45 32H49" [attr.stroke]="theme === 'dark' ? '#D5E7DE' : '#0F3D2E'" stroke-width="2" stroke-linecap="round" />
          <path d="M32 45V49" [attr.stroke]="theme === 'dark' ? '#D5E7DE' : '#0F3D2E'" stroke-width="2" stroke-linecap="round" />
          <path d="M19 32H15" [attr.stroke]="theme === 'dark' ? '#D5E7DE' : '#0F3D2E'" stroke-width="2" stroke-linecap="round" />
          <path d="M32 32 32 22" [attr.stroke]="theme === 'dark' ? '#F5F7F4' : '#111111'" stroke-width="2.8" stroke-linecap="round" />
          <path d="M32 32 41 28" [attr.stroke]="theme === 'dark' ? '#C9B06D' : '#1F7A63'" stroke-width="2.8" stroke-linecap="round" />
          <path d="M20 48 44 16" [attr.stroke]="theme === 'dark' ? '#ffffff18' : '#0F3D2E12'" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </span>

      <span class="min-w-0">
        <span
          class="block font-brand leading-none tracking-[0.02em]"
          [ngClass]="{
            'text-[2rem]': size !== 'sm',
            'text-[1.55rem]': size === 'sm'
          }"
        >
          Caliber Watch
        </span>
        @if (showTagline) {
          <span
            class="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.38em]"
            [ngClass]="{
              'text-white/60': theme === 'dark',
              'text-[#0F3D2E]/70': theme !== 'dark'
            }"
          >
            Timecrafted
          </span>
        }
      </span>
    </a>
  `
})
export class BrandLogoComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() showTagline = true;
  @Input() disableLink = false;
  @Input() ariaLabel = 'Caliber home';
}
