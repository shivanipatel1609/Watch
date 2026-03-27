import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Watch } from '../../models/watch.model';

@Component({
  selector: 'app-watch-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#E5E5E5] bg-white p-5 shadow-[0_18px_45px_rgba(17,17,17,0.05)] transition duration-500 hover:-translate-y-2 hover:border-[#1F7A63] hover:shadow-[0_30px_80px_rgba(15,61,46,0.12)]">
      <div class="absolute inset-x-6 top-0 h-24 rounded-b-full bg-[radial-gradient(circle,rgba(31,122,99,0.18),rgba(31,122,99,0))] blur-2xl"></div>

      <div class="relative flex h-full flex-col">
        <a [routerLink]="['/watch', watch.id]" class="flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f7f7f5] p-6">
          <img [src]="watch.images[0]" [alt]="watch.name" loading="lazy" class="h-full w-full object-contain object-center transition duration-700 group-hover:scale-105">
        </a>

        <div class="mt-5 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-xs uppercase tracking-[0.35em] text-[#1F7A63]">{{ watch.brand }}</p>
            <a [routerLink]="['/watch', watch.id]" class="mt-2 block min-h-[5.5rem] font-display text-[1.8rem] leading-tight text-[#111111]">
              {{ watch.name }}
            </a>
          </div>
          <p class="shrink-0 rounded-full border border-[#E5E5E5] bg-[#F9F9F9] px-3 py-1 text-xs text-[#111111]/70">
            {{ watch.rating }} &#9733;
          </p>
        </div>

        <p class="mt-4 min-h-[3.75rem] line-clamp-2 text-sm leading-7 text-[#5f5f5f]">{{ watch.description }}</p>

        <div class="mt-auto pt-6">
          <div class="flex items-center justify-between gap-2">
            <p class="shrink-0 whitespace-nowrap font-price text-[1.7rem] leading-none tracking-[0.01em] text-[#0F3D2E]">₹{{ watch.price | number:'1.0-0' }}</p>
            <div class="flex min-w-0 items-center justify-end gap-2">
              <a [routerLink]="['/watch', watch.id]" class="shrink-0 whitespace-nowrap rounded-full border border-[#E5E5E5] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
                Details
              </a>
              <button type="button" (click)="add.emit(watch)" class="green-button shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  `
})
export class WatchCardComponent {
  @Input({ required: true }) watch!: Watch;
  @Output() add = new EventEmitter<Watch>();
}
