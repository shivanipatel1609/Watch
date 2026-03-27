import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WatchCardComponent } from '../../components/shared/watch-card.component';
import { Watch } from '../../models/watch.model';
import { CartService } from '../../services/cart.service';
import { WatchService } from '../../services/watch.service';

type SortOption =
  | 'featured'
  | 'price-low-high'
  | 'price-high-low'
  | 'rating-high-low'
  | 'name-a-z';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, FormsModule, WatchCardComponent],
  template: `
    <section class="relative overflow-hidden px-6 py-16">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(31,122,99,0.06),transparent_22%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_52%,#f4f8f6_100%)]"></div>

      <div class="relative mx-auto max-w-7xl">
        <div class="rounded-[2.25rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_20px_50px_rgba(17,17,17,0.05)] sm:p-10">
          <p class="text-sm uppercase tracking-[0.45em] text-[#1F7A63]">Collection</p>
          <div class="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 class="font-display text-5xl text-[#111111]">Luxury Watch Collection</h1>
              <p class="mt-4 max-w-2xl text-base leading-7 text-[#111111]/64">
                Discover refined timepieces selected for heritage, craftsmanship, and modern presence.
              </p>
            </div>
            <input
              [(ngModel)]="query"
              type="text"
              placeholder="Search watches, brands, categories"
              class="w-full rounded-full border border-[#E5E5E5] bg-[#F9F9F9] px-6 py-4 text-[#111111] outline-none placeholder:text-[#111111]/42 lg:max-w-md"
            >
          </div>

          <div class="mt-8 grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
            <select
              [(ngModel)]="selectedBrand"
              class="rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-[#111111] outline-none"
            >
              <option value="all">All Brands</option>
              @for (brand of brands(); track brand) {
                <option [value]="brand">{{ brand }}</option>
              }
            </select>

            <select
              [(ngModel)]="selectedCategory"
              class="rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-[#111111] outline-none"
            >
              <option value="all">All Categories</option>
              @for (category of categories(); track category) {
                <option [value]="category">{{ formatCategory(category) }}</option>
              }
            </select>

            <select
              [(ngModel)]="availability"
              class="rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-[#111111] outline-none"
            >
              <option value="all">All Availability</option>
              <option value="in-stock">In Stock Only</option>
              <option value="low-stock">Low Stock</option>
            </select>

            <select
              [(ngModel)]="priceRange"
              class="rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-[#111111] outline-none"
            >
              <option value="all">All Prices</option>
              <option value="under-50000">Under ₹50,000</option>
              <option value="50000-100000">₹50,000 to ₹1,00,000</option>
              <option value="100000-300000">₹1,00,000 to ₹3,00,000</option>
              <option value="above-300000">Above ₹3,00,000</option>
            </select>

            <select
              [(ngModel)]="sort"
              class="rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-[#111111] outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating-high-low">Top Rated</option>
              <option value="name-a-z">Name: A to Z</option>
            </select>

            <button
              type="button"
              (click)="toggleFeaturedOnly()"
              class="rounded-[1.2rem] border px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] transition"
              [ngClass]="featuredOnly() ? 'border-[#0F3D2E] bg-[#0F3D2E] text-white' : 'border-[#E5E5E5] bg-white text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]'"
            >
              Featured
            </button>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3 text-sm">
            @if (selectedBrand() !== 'all') {
              <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[#111111]/70">
                Brand: {{ selectedBrand() }}
              </span>
            }
            @if (selectedCategory() !== 'all') {
              <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[#111111]/70">
                Category: {{ formatCategory(selectedCategory()) }}
              </span>
            }
            @if (availability() !== 'all') {
              <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[#111111]/70">
                {{ availabilityLabel() }}
              </span>
            }
            @if (priceRange() !== 'all') {
              <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[#111111]/70">
                {{ priceRangeLabel() }}
              </span>
            }
            @if (featuredOnly()) {
              <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[#111111]/70">
                Featured Only
              </span>
            }
            @if (hasActiveFilters()) {
              <button type="button" (click)="resetFilters()" class="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F3D2E] hover:text-[#1F7A63]">
                Clear Filters
              </button>
            }
          </div>
        </div>

        @if (filtered().length) {
          <div class="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            @for (watch of filtered(); track watch.id) {
              <app-watch-card [watch]="watch" (add)="cartService.addToCart($event)"></app-watch-card>
            }
          </div>
        } @else {
          <div class="mt-12 rounded-[2rem] border border-dashed border-[#D8E4DF] bg-white p-12 text-center shadow-[0_18px_45px_rgba(17,17,17,0.04)]">
            <p class="text-sm font-semibold uppercase tracking-[0.4em] text-[#1F7A63]">No Matches</p>
            <h2 class="mt-4 font-display text-4xl text-[#111111]">No watches fit this filter set</h2>
            <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#111111]/62">
              Adjust your search, switch the sort order, or clear filters to explore the full collection again.
            </p>
            <button type="button" (click)="resetFilters()" class="mt-8 rounded-full bg-[#0F3D2E] px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#1F7A63]">
              Reset Collection Filters
            </button>
          </div>
        }
      </div>
    </section>
  `
})
export class CatalogPageComponent {
  readonly cartService = inject(CartService);
  private readonly watchService = inject(WatchService);

  readonly queryState = signal('');
  readonly selectedBrand = signal('all');
  readonly selectedCategory = signal('all');
  readonly availability = signal<'all' | 'in-stock' | 'low-stock'>('all');
  readonly priceRange = signal<'all' | 'under-50000' | '50000-100000' | '100000-300000' | 'above-300000'>('all');
  readonly sort = signal<SortOption>('featured');
  readonly featuredOnly = signal(false);

  get query(): string {
    return this.queryState();
  }

  set query(value: string) {
    this.queryState.set(value);
  }

  readonly allWatches = computed(() => this.watchService.watches());
  readonly brands = computed(() => [...new Set(this.allWatches().map((watch) => watch.brand))].sort((a, b) => a.localeCompare(b)));
  readonly categories = computed(() => [...new Set(this.allWatches().map((watch) => watch.category))].sort((a, b) => a.localeCompare(b)));

  readonly filtered = computed(() => {
    const query = this.queryState().trim().toLowerCase();
    let watches = this.allWatches().filter((watch) => this.matchesSearch(watch, query));

    if (this.selectedBrand() !== 'all') {
      watches = watches.filter((watch) => watch.brand === this.selectedBrand());
    }

    if (this.selectedCategory() !== 'all') {
      watches = watches.filter((watch) => watch.category === this.selectedCategory());
    }

    if (this.availability() === 'in-stock') {
      watches = watches.filter((watch) => watch.stock > 0);
    } else if (this.availability() === 'low-stock') {
      watches = watches.filter((watch) => watch.stock > 0 && watch.stock <= 5);
    }

    if (this.priceRange() !== 'all') {
      watches = watches.filter((watch) => this.matchesPriceRange(watch.price, this.priceRange()));
    }

    if (this.featuredOnly()) {
      watches = watches.filter((watch) => !!watch.featured);
    }

    return this.sortWatches(watches, this.sort());
  });

  readonly hasActiveFilters = computed(() =>
    !!this.queryState().trim() ||
    this.selectedBrand() !== 'all' ||
    this.selectedCategory() !== 'all' ||
    this.availability() !== 'all' ||
    this.priceRange() !== 'all' ||
    this.sort() !== 'featured' ||
    this.featuredOnly()
  );

  toggleFeaturedOnly(): void {
    this.featuredOnly.update((value) => !value);
  }

  resetFilters(): void {
    this.queryState.set('');
    this.selectedBrand.set('all');
    this.selectedCategory.set('all');
    this.availability.set('all');
    this.priceRange.set('all');
    this.sort.set('featured');
    this.featuredOnly.set(false);
  }

  formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  availabilityLabel(): string {
    if (this.availability() === 'in-stock') {
      return 'In Stock Only';
    }

    if (this.availability() === 'low-stock') {
      return 'Low Stock';
    }

    return 'All Availability';
  }

  priceRangeLabel(): string {
    switch (this.priceRange()) {
      case 'under-50000':
        return 'Under ₹50,000';
      case '50000-100000':
        return '₹50,000 to ₹1,00,000';
      case '100000-300000':
        return '₹1,00,000 to ₹3,00,000';
      case 'above-300000':
        return 'Above ₹3,00,000';
      default:
        return 'All Prices';
    }
  }

  private matchesSearch(watch: Watch, query: string): boolean {
    if (!query) {
      return true;
    }

    return `${watch.brand} ${watch.name} ${watch.category} ${watch.description}`.toLowerCase().includes(query);
  }

  private matchesPriceRange(price: number, range: 'all' | 'under-50000' | '50000-100000' | '100000-300000' | 'above-300000'): boolean {
    switch (range) {
      case 'under-50000':
        return price < 50000;
      case '50000-100000':
        return price >= 50000 && price <= 100000;
      case '100000-300000':
        return price > 100000 && price <= 300000;
      case 'above-300000':
        return price > 300000;
      default:
        return true;
    }
  }

  private sortWatches(watches: Watch[], sort: SortOption): Watch[] {
    const sorted = [...watches];

    switch (sort) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-high-low':
        return sorted.sort((a, b) => b.rating - a.rating || a.price - b.price);
      case 'name-a-z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating);
    }
  }
}
