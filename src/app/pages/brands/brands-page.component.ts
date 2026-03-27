import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface BrandItem {
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-brands-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-6 py-16">
      <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_18px_40px_rgba(17,17,17,0.04)]">
        <p class="text-sm uppercase tracking-[0.45em] text-[#1F7A63]">Curated Houses</p>
        <h1 class="mt-4 font-display text-5xl text-[#111111]">Explore Our Brands</h1>
        <p class="mt-5 max-w-3xl leading-8 text-[#111111]/64">
          Caliber partners with respected watchmakers so every collection feels authentic, elevated, and timeless.
        </p>
        <div class="mt-8 flex flex-col gap-4 lg:flex-row">
          <input [(ngModel)]="query" type="text" placeholder="Search brands..." class="flex-1 rounded-full border border-[#E5E5E5] bg-[#F9F9F9] px-6 py-4 text-[#111111]">
          <a routerLink="/watches" class="inline-flex items-center justify-center rounded-full bg-[#0F3D2E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#1F7A63]">
            Browse Watches
          </a>
        </div>
      </div>

      <div class="mt-12 grid gap-8 md:grid-cols-2">
        @for (brand of filteredBrands(); track brand.name) {
          <article class="overflow-hidden rounded-[2rem] border border-[#E5E5E5] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <img [src]="brand.image" [alt]="brand.name" class="h-72 w-full object-cover">
            <div class="p-8">
              <h2 class="font-display text-3xl text-[#111111]">{{ brand.name }}</h2>
              <p class="mt-4 leading-8 text-[#111111]/64">{{ brand.description }}</p>
              <a routerLink="/watches" class="mt-6 inline-block text-sm uppercase tracking-[0.25em] text-[#0F3D2E]">View Collection</a>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class BrandsPageComponent {
  query = '';

  readonly brands: BrandItem[] = [
    {
      name: 'Rolex',
      description: 'A pioneer in the development of the wristwatch and originator of major watchmaking innovations.',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Patek Philippe',
      description: 'Renowned for creating some of the most complicated and prestigious watches in the world.',
      image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Audemars Piguet',
      description: 'Independent master watchmakers since 1875, known for bold architecture and technical excellence.',
      image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80'
    },
    {
      name: 'Omega',
      description: 'One of the most recognized Swiss names in horology, balancing heritage with technical performance.',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  filteredBrands(): BrandItem[] {
    const term = this.query.trim().toLowerCase();
    return term
      ? this.brands.filter((brand) => `${brand.name} ${brand.description}`.toLowerCase().includes(term))
      : this.brands;
  }
}
