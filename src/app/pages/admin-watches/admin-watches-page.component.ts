import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Watch } from '../../models/watch.model';
import { WatchService } from '../../services/watch.service';

type WatchForm = {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  rating: number;
  image: string;
  featured: boolean;
};

@Component({
  selector: 'app-admin-watches-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(203,213,225,0.38),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f6f7f8_55%,#eef1f4_100%)]"></div>
      <div class="relative mx-auto max-w-7xl">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#6b7280]">Admin / Watches</p>
            <h1 class="mt-4 font-display text-5xl text-[#111111] md:text-6xl">Watches Inventory</h1>
            <p class="mt-5 max-w-3xl text-lg leading-8 text-[#4b5563]">
              Add new watches, update existing inventory, and remove references that are no longer available.
            </p>
          </div>
          <button type="button" (click)="openCreate()" class="rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#303030]">
            Add Watch
          </button>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <div class="rounded-[1.75rem] border border-[#d8dde3] bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Total Watches</p>
            <p class="mt-3 text-4xl text-[#111111]">{{ watchService.watches().length }}</p>
          </div>
          <div class="rounded-[1.75rem] border border-[#d8dde3] bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Featured</p>
            <p class="mt-3 text-4xl text-[#111111]">{{ featuredCount() }}</p>
          </div>
          <div class="rounded-[1.75rem] border border-[#d8dde3] bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Low Stock</p>
            <p class="mt-3 text-4xl text-[#111111]">{{ lowStockCount() }}</p>
          </div>
        </div>

        <div class="mt-10 overflow-hidden rounded-[2rem] border border-[#d8dde3] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <table class="w-full text-left">
            <thead class="border-b border-[#d8dde3] text-[#6b7280]">
              <tr>
                <th class="px-6 py-4">Watch</th>
                <th class="px-6 py-4">Brand</th>
                <th class="px-6 py-4">Price</th>
                <th class="px-6 py-4">Stock</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (watch of watchService.watches(); track watch.id) {
                <tr class="border-b border-[#eef1f4] last:border-b-0">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <img [src]="watch.images[0]" [alt]="watch.name" class="h-14 w-14 rounded-[1rem] object-cover">
                      <div>
                        <p class="text-lg text-[#111111]">{{ watch.name }}</p>
                        <p class="text-sm text-[#6b7280]">{{ watch.category | titlecase }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-[#6b7280]">{{ watch.brand }}</td>
                  <td class="px-6 py-4 text-[#111111]">Rs {{ watch.price | number:'1.0-0' }}</td>
                  <td class="px-6 py-4" [ngClass]="watch.stock <= 5 ? 'text-[#6b7280]' : 'text-[#111111]'">{{ watch.stock }}</td>
                  <td class="px-6 py-4">
                    <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" [ngClass]="watch.featured ? 'bg-[#111111] text-white' : 'bg-[#eef1f4] text-[#111111]'">
                      {{ watch.featured ? 'Featured' : 'Standard' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex justify-end gap-3">
                      <button type="button" (click)="openEdit(watch)" class="rounded-full border border-[#d8dde3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]">
                        Edit
                      </button>
                      <button type="button" (click)="confirmDelete(watch)" class="rounded-full border border-[#cbd5e1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (formOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/25 p-6 backdrop-blur-sm">
          <div class="flex min-h-full items-start justify-center py-4">
            <div class="w-full max-w-3xl rounded-[2rem] border border-[#d8dde3] bg-white p-8 shadow-[0_26px_60px_rgba(15,23,42,0.16)]">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold uppercase tracking-[0.32em] text-[#6b7280]">Watch Editor</p>
                  <h2 class="mt-3 font-display text-4xl text-[#111111]">{{ editingId() ? 'Update Watch' : 'Add Watch' }}</h2>
                </div>
                <button type="button" (click)="closeForm()" class="rounded-full border border-[#d8dde3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]">
                  Close
                </button>
              </div>

              <form class="mt-8 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2" (ngSubmit)="saveWatch()">
                <div class="grid gap-5 md:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Name</label>
                    <input [(ngModel)]="form.name" name="name" class="w-full rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none" required>
                  </div>
                  <div>
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Brand</label>
                    <input [(ngModel)]="form.brand" name="brand" class="w-full rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none" required>
                  </div>
                  <div>
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Price</label>
                    <input [(ngModel)]="form.price" name="price" type="number" class="w-full rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none" required>
                  </div>
                  <div>
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Stock</label>
                    <input [(ngModel)]="form.stock" name="stock" type="number" class="w-full rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none" required>
                  </div>
                  <div>
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Category</label>
                    <input [(ngModel)]="form.category" name="category" class="w-full rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none" required>
                  </div>
                  <div>
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Rating</label>
                    <input [(ngModel)]="form.rating" name="rating" type="number" min="0" max="5" step="0.1" class="w-full rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none" required>
                  </div>
                  <div class="md:col-span-2">
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Upload Image</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      (change)="onImageSelected($event)"
                      class="w-full rounded-[1rem] border border-dashed border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#111111] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    >
                    <p class="mt-2 text-sm text-[#6b7280]">Upload a watch image to use in the catalog and admin inventory.</p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Preview</label>
                    <div class="rounded-[1.25rem] border border-[#d8dde3] bg-[#f8fafc] p-4">
                      <img [src]="form.image" alt="Watch preview" class="h-48 w-full rounded-[1rem] object-contain">
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Description</label>
                    <textarea [(ngModel)]="form.description" name="description" rows="4" class="w-full rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-3 text-[#111111] outline-none" required></textarea>
                  </div>
                  <label class="md:col-span-2 flex items-center justify-between rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-4 py-4">
                    <span class="text-[#111111]">Show in featured collection</span>
                    <input [(ngModel)]="form.featured" name="featured" type="checkbox" class="h-4 w-4 accent-[#111111]">
                  </label>
                </div>

                <div class="sticky bottom-0 mt-6 flex flex-wrap items-center gap-4 border-t border-[#eef1f4] bg-white pt-5">
                  <button type="submit" class="rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white">
                    {{ editingId() ? 'Update Watch' : 'Add Watch' }}
                  </button>
                  <button type="button" (click)="closeForm()" class="rounded-full border border-[#d8dde3] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#111111]">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class AdminWatchesPageComponent {
  readonly watchService = inject(WatchService);

  readonly formOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly featuredCount = computed(() => this.watchService.watches().filter((watch) => watch.featured).length);
  readonly lowStockCount = computed(() => this.watchService.watches().filter((watch) => watch.stock <= 5).length);

  form: WatchForm = this.createEmptyForm();

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.createEmptyForm();
    this.formOpen.set(true);
  }

  openEdit(watch: Watch): void {
    this.editingId.set(watch.id);
    this.form = {
      id: watch.id,
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      description: watch.description,
      category: watch.category,
      stock: watch.stock,
      rating: watch.rating,
      image: watch.images[0] ?? '',
      featured: !!watch.featured
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.editingId.set(null);
    this.form = this.createEmptyForm();
  }

  async saveWatch(): Promise<void> {
    const image = this.form.image.startsWith('data:')
      ? await this.watchService.uploadWatchImage(this.form.image, this.form.name)
      : this.form.image;

    const payload = {
      name: this.form.name,
      brand: this.form.brand,
      price: this.form.price,
      description: this.form.description,
      category: this.form.category,
      stock: this.form.stock,
      rating: this.form.rating,
      accent: 'from-[#111111] to-[#c0c7d0]',
      featured: this.form.featured,
      images: [image],
      specifications: [],
      reviews: []
    };

    if (this.editingId()) {
      await this.watchService.updateWatch(this.editingId()!, payload);
    } else {
      await this.watchService.addWatch(payload);
    }

    this.closeForm();
  }

  async deleteWatch(id: string): Promise<void> {
    await this.watchService.deleteWatch(id);
  }

  confirmDelete(watch: Watch): void {
    const shouldDelete = window.confirm(`Delete "${watch.name}" from inventory?`);
    if (!shouldDelete) {
      return;
    }

    void this.deleteWatch(watch.id);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        this.form.image = result;
      }
    };
    reader.readAsDataURL(file);
  }

  private createEmptyForm(): WatchForm {
    return {
      id: '',
      name: '',
      brand: '',
      price: 0,
      description: '',
      category: 'luxury',
      stock: 0,
      rating: 5,
      image: 'assets/images/watches/Rolex Submariner Pro/r1.png',
      featured: false
    };
  }
}
