import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_24%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_58%,#f9f9f9_100%)]"></div>

      <div class="relative mx-auto max-w-6xl">
        <div class="rounded-[2.25rem] border border-[#E5E5E5] bg-white p-10 text-center shadow-[0_20px_50px_rgba(17,17,17,0.05)]">
          <p class="text-sm uppercase tracking-[0.45em] text-[#1F7A63]">Client Services</p>
          <h1 class="mt-4 font-display text-5xl text-[#111111]">{{ title }}</h1>
          <p class="mx-auto mt-6 max-w-2xl leading-8 text-[#111111]/64">{{ subtitle }}</p>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <a routerLink="/contact" class="rounded-full border border-[#E5E5E5] px-6 py-4 text-sm uppercase tracking-[0.2em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">Contact Caliber</a>
            <a routerLink="/watches" class="rounded-full bg-[#0F3D2E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#1F7A63]">Shop Watches</a>
          </div>
        </div>

        @if (isContactPage()) {
          <div class="mt-10 grid gap-6 md:grid-cols-3">
            <article class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_16px_36px_rgba(17,17,17,0.04)]">
              <p class="text-xs uppercase tracking-[0.3em] text-[#1F7A63]">Email</p>
              <h2 class="mt-4 font-display text-3xl text-[#111111]">Concierge Desk</h2>
              <p class="mt-4 leading-8 text-[#111111]/64">For sourcing requests, ownership support, and aftercare assistance.</p>
              <p class="mt-6 text-[#0F3D2E]">caliberwatch&#64;store.com</p>
            </article>

            <article class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_16px_36px_rgba(17,17,17,0.04)]">
              <p class="text-xs uppercase tracking-[0.3em] text-[#1F7A63]">Call</p>
              <h2 class="mt-4 font-display text-3xl text-[#111111]">Private Support</h2>
              <p class="mt-4 leading-8 text-[#111111]/64">Speak directly with Caliber for delivery updates and product guidance.</p>
              <p class="mt-6 text-[#0F3D2E]">+91 63597 81054</p>
            </article>

            <article class="rounded-[2rem] border border-[#B8D5CC] bg-[#0F3D2E] p-8 text-white shadow-[0_18px_40px_rgba(15,61,46,0.16)]">
              <p class="text-xs uppercase tracking-[0.3em] text-white/72">Hours</p>
              <h2 class="mt-4 font-display text-3xl">Client Availability</h2>
              <p class="mt-4 leading-8 text-white/78">Monday to Saturday, 9:00 AM to 7:00 PM CET. Priority concierge replies within 24 hours.</p>
            </article>
          </div>
        }
      </div>
    </section>
  `
})
export class InfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly isContactPage = computed(() => this.route.snapshot.routeConfig?.path === 'contact');

  get title(): string {
    return this.route.snapshot.data['title'] ?? 'Information';
  }

  get subtitle(): string {
    return this.route.snapshot.data['subtitle'] ?? '';
  }
}
