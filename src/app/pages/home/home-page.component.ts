import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { Watch } from '../../models/watch.model';
import { CartService } from '../../services/cart.service';
import { WatchService } from '../../services/watch.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section-shell relative isolate overflow-hidden bg-white">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,61,46,0.08),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f9f9f9_100%)]"></div>
      <div class="absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,61,46,0.12),rgba(15,61,46,0))] blur-3xl"></div>

      <div class="relative mx-auto grid min-h-[78vh] max-w-7xl gap-12 px-6 pb-12 pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-16 lg:pt-20">
        <div class="hero-copy max-w-xl">
          <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#1F7A63]">Caliber Maison</p>
          <h1 class="mt-5 font-display text-[4.2rem] leading-[0.92] text-[#111111] sm:text-[4.8rem] lg:text-[5rem]">
            Timeless
            <br>
            Precision
          </h1>
          <p class="mt-5 max-w-lg text-base leading-8 text-[#111111]/68 sm:text-lg">
            A modern luxury watch house shaped by restraint, fine craftsmanship, and a quiet emerald signature.
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            <a routerLink="/catalog" class="emerald-button inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em]">
              Explore Collection
              <span class="text-lg leading-none">+</span>
            </a>
            <a routerLink="/about" class="inline-flex items-center rounded-full border border-[#E5E5E5] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
              Our Heritage
            </a>
          </div>

          <div class="mt-8 grid max-w-lg gap-4 border-t border-[#E5E5E5] pt-6 sm:grid-cols-3">
            <div>
              <p class="font-display text-[1.8rem] text-[#0F3D2E]">1954</p>
              <p class="mt-2 text-xs uppercase tracking-[0.28em] text-[#111111]/58">Design Ethos</p>
            </div>
            <div>
              <p class="font-display text-[1.8rem] text-[#0F3D2E]">Swiss</p>
              <p class="mt-2 text-xs uppercase tracking-[0.28em] text-[#111111]/58">Craft Standards</p>
            </div>
            <div>
              <p class="font-display text-[1.8rem] text-[#0F3D2E]">24H</p>
              <p class="mt-2 text-xs uppercase tracking-[0.28em] text-[#111111]/58">Concierge Service</p>
            </div>
          </div>
        </div>

        <div class="hero-visual relative">
          <div class="absolute inset-x-12 top-8 h-[28rem] rounded-[3rem] border border-white/70 bg-white/70 blur-sm"></div>
          <div class="relative mx-auto max-w-[38rem] rounded-[2.5rem] border border-[#E5E5E5] bg-[linear-gradient(180deg,#ffffff,rgba(249,249,249,0.96))] p-6 shadow-[0_40px_80px_rgba(17,17,17,0.09)]">
            <div class="rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(15,61,46,0.08),rgba(255,255,255,0.96)_54%)] px-6 pb-4 pt-8">
              <img src="assets/images/watches/Rolex Submariner Pro/r1.png" alt="Caliber signature luxury watch" class="hero-watch mx-auto w-full max-w-[24rem] object-contain drop-shadow-[0_26px_36px_rgba(17,17,17,0.18)]">
            </div>

            <div class="mt-5 flex items-center justify-between rounded-[1.6rem] border border-[#E5E5E5] bg-white px-5 py-4">
              <div>
                <p class="text-xs uppercase tracking-[0.28em] text-[#1F7A63]">Signature Model</p>
                <p class="mt-2 font-display text-2xl text-[#111111]">Emerald Chronometer</p>
              </div>
              <p class="text-sm uppercase tracking-[0.26em] text-[#111111]/54">Automatic</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#F9F9F9]">
      <div class="mx-auto max-w-7xl px-6 py-24">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.4em] text-[#1F7A63]">Featured Collection</p>
            <h2 class="mt-3 max-w-2xl font-display text-4xl text-[#111111] sm:text-5xl">A curated line of refined instruments for modern collectors.</h2>
          </div>
          <a routerLink="/catalog" class="text-sm font-semibold uppercase tracking-[0.28em] text-[#111111]/60 hover:text-[#0F3D2E]">View Collection</a>
        </div>

        <div class="reveal-grid mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          @for (watch of featured; track watch.id) {
            <article class="collection-card group flex h-full flex-col rounded-[2rem] border border-[#E5E5E5] bg-white p-5 shadow-[0_22px_50px_rgba(17,17,17,0.05)] transition duration-500 hover:-translate-y-2 hover:border-[#1F7A63] hover:shadow-[0_32px_70px_rgba(15,61,46,0.12)]">
              <a [routerLink]="['/watch', watch.id]" class="flex aspect-square items-center justify-center overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#fafafa,#f2f5f4)] p-6">
                <img [src]="watch.images[0]" [alt]="watch.name" loading="lazy" class="h-full w-full object-contain object-center transition duration-700 group-hover:scale-105">
              </a>
              <div class="mt-5 flex flex-1 flex-col">
                <p class="text-xs uppercase tracking-[0.3em] text-[#1F7A63]">{{ watch.brand }}</p>
                <h3 class="mt-2 min-h-[5.5rem] font-display text-[1.8rem] leading-tight text-[#111111]">{{ watch.name }}</h3>
                <div class="mt-auto flex items-center justify-between gap-4 pt-5">
                  <p class="text-sm uppercase tracking-[0.24em] text-[#111111]/56">&#8377;{{ watch.price | number:'1.0-0' }}</p>
                  <button type="button" (click)="cartService.addToCart(watch)" class="rounded-full border border-[#0F3D2E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white">
                    Add
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="bg-white">
      <div class="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div class="reveal-up overflow-hidden rounded-[2.5rem] border border-[#E5E5E5] bg-[linear-gradient(180deg,#fbfbfb,#f4f7f6)] p-6 shadow-[0_28px_60px_rgba(17,17,17,0.06)]">
          <img src="assets/images/watches/Patek Philippe Nautilus/175395-51883.avif" alt="Luxury watch craftsmanship detail" class="h-full w-full rounded-[2rem] object-cover">
        </div>
        <div class="reveal-up">
          <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#1F7A63]">About Caliber</p>
          <h2 class="mt-4 max-w-xl font-display text-4xl leading-tight text-[#111111] sm:text-5xl">Crafted with heritage, presented with modern restraint.</h2>
          <p class="mt-6 max-w-xl text-lg leading-8 text-[#111111]/68">
            Caliber is built around the idea that true luxury does not need excess. Every piece is chosen for proportion, precision, and enduring value.
          </p>
          <p class="mt-5 max-w-xl text-base leading-8 text-[#111111]/64">
            From polished case finishing to movement integrity and aftercare, the experience is designed to feel deliberate, serene, and highly personal.
          </p>
          <a routerLink="/about" class="mt-8 inline-flex rounded-full bg-[#0F3D2E] px-7 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-white shadow-[0_24px_44px_rgba(15,61,46,0.16)] hover:bg-[#1F7A63]">
            Discover More
          </a>
        </div>
      </div>
    </section>

    <section class="bg-[#F9F9F9]">
      <div class="mx-auto max-w-5xl px-6 py-24 text-center">
        <p class="reveal-up text-sm font-semibold uppercase tracking-[0.42em] text-[#1F7A63]">Brand Story</p>
        <h2 class="reveal-up mt-4 font-display text-4xl text-[#111111] sm:text-5xl">Designed to be admired quietly.</h2>
        <p class="reveal-up mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#111111]/66">
          Inspired by the composure of the world’s great watch maisons, Caliber pairs a pristine white presentation with a deep emerald identity to create an atmosphere of confidence, heritage, and calm exclusivity.
        </p>

        <div class="mt-14 grid gap-8 lg:grid-cols-3">
          @for (testimonial of testimonials; track testimonial.name) {
            <article class="reveal-up rounded-[2rem] border border-[#E5E5E5] bg-white px-8 py-10 text-left shadow-[0_20px_50px_rgba(17,17,17,0.05)]">
              <p class="text-sm uppercase tracking-[0.34em] text-[#1F7A63]">Client Voice</p>
              <p class="mt-5 text-lg leading-8 text-[#111111]">{{ testimonial.quote }}</p>
              <p class="mt-6 font-semibold uppercase tracking-[0.22em] text-[#111111]/56">{{ testimonial.name }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `
})
export class HomePageComponent implements AfterViewInit {
  readonly watchService = inject(WatchService);
  readonly cartService = inject(CartService);
  readonly featured = this.getFeaturedSelection();
  readonly testimonials = [
    {
      name: 'Arjun Mehta',
      quote: 'Every interaction felt measured and elegant. The site carries the same confidence as the watches themselves.'
    },
    {
      name: 'Elena Rossi',
      quote: 'Caliber feels premium without being loud. The whitespace, typography, and product focus are exceptionally well judged.'
    },
    {
      name: 'Daniel Harper',
      quote: 'A rare luxury storefront that feels editorial, refined, and genuinely high-end from first scroll to checkout.'
    }
  ];

  async ngAfterViewInit(): Promise<void> {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-copy > *', {
      opacity: 0,
      y: 28,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out'
    });

    gsap.from('.hero-visual', {
      opacity: 0,
      y: 24,
      scale: 0.96,
      duration: 1,
      ease: 'power3.out',
      delay: 0.18
    });

    gsap.to('.hero-watch', {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-watch',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 40,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 84%'
        }
      });
    });
  }

  private getFeaturedSelection(): Watch[] {
    const preferredIds = [
      'rolex-submariner-pro',
      'omega-seamaster',
      'tag-heuer-carrera',
      'patek-philippe-nautilus'
    ];

    const watches = this.watchService.watches();
    return preferredIds
      .map((id) => watches.find((watch) => watch.id === id))
      .filter((watch): watch is Watch => !!watch);
  }
}
