import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_24%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_56%,#f9f9f9_100%)]"></div>
      <div class="relative mx-auto max-w-7xl">
        <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#1F7A63]">About Caliber</p>
            <h1 class="mt-6 max-w-4xl font-display text-5xl leading-tight text-[#111111] md:text-6xl">
              A modern destination for collectors who value restraint, craft, and permanence.
            </h1>
            <p class="mt-7 max-w-2xl text-lg leading-9 text-[#111111]/66">
              Caliber brings together iconic watchmaking, elevated presentation, and collector-first service. Our approach is simple: curate fewer, better timepieces and present them with the same care they deserve in person.
            </p>
          </div>

          <div class="rounded-[2.25rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_24px_60px_rgba(17,17,17,0.06)]">
            <div class="grid gap-5 sm:grid-cols-2">
              @for (stat of stats; track stat.label) {
                <div class="rounded-[1.5rem] border border-[#E5E5E5] bg-[#F9F9F9] p-6">
                  <p class="font-display text-4xl text-[#0F3D2E]">{{ stat.value }}</p>
                  <p class="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#111111]/58">{{ stat.label }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <article class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
            <p class="text-sm font-semibold uppercase tracking-[0.38em] text-[#1F7A63]">Our Philosophy</p>
            <h2 class="mt-4 font-display text-4xl text-[#111111]">Luxury should feel informed, calm, and deeply considered.</h2>
            <p class="mt-6 text-lg leading-8 text-[#111111]/64">
              We focus on watches with enduring design language, technical credibility, and meaningful ownership appeal. Whether you are buying your first serious piece or adding to a growing collection, Caliber is built to make that process feel clear and elevated.
            </p>
          </article>

          <div class="grid gap-6 md:grid-cols-3">
            @for (pillar of pillars; track pillar.title) {
              <article class="rounded-[2rem] border border-[#E5E5E5] bg-white p-7 shadow-[0_16px_34px_rgba(17,17,17,0.04)]">
                <p class="text-sm font-semibold uppercase tracking-[0.35em] text-[#1F7A63]">{{ pillar.label }}</p>
                <h3 class="mt-4 text-2xl text-[#111111]">{{ pillar.title }}</h3>
                <p class="mt-4 leading-8 text-[#111111]/64">{{ pillar.description }}</p>
              </article>
            }
          </div>
        </div>

        <div class="mt-16 rounded-[2.25rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_20px_45px_rgba(17,17,17,0.05)] lg:p-10">
          <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.4em] text-[#1F7A63]">Brand Journey</p>
              <h2 class="mt-4 font-display text-4xl text-[#111111]">Built through curation, service, and trust.</h2>
            </div>
            <p class="max-w-2xl text-lg leading-8 text-[#111111]/64">
              The Caliber story has always centered on a better ownership experience: thoughtful selection, authentic product presentation, and confidence at every step.
            </p>
          </div>

          <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            @for (item of timeline; track item.year) {
              <article class="rounded-[1.75rem] border border-[#E5E5E5] bg-[#F9F9F9] p-6">
                <p class="font-brand text-lg tracking-[0.14em] text-[#1F7A63]">{{ item.year }}</p>
                <h3 class="mt-4 text-2xl text-[#111111]">{{ item.title }}</h3>
                <p class="mt-4 leading-7 text-[#111111]/64">{{ item.description }}</p>
              </article>
            }
          </div>
        </div>

        <div class="mt-16 rounded-[2.25rem] border border-[#1f5a49] bg-[linear-gradient(180deg,#134c3a_0%,#0f3d2e_100%)] px-8 py-10 text-center shadow-[0_22px_50px_rgba(15,61,46,0.18)]">
          <p class="text-sm font-semibold uppercase tracking-[0.4em] text-[#d7ebe4]">Begin Your Collection</p>
          <h2 class="mt-4 font-display text-4xl text-white">Discover watches chosen for lasting appeal.</h2>
          <p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#edf7f3]">
            Explore the Caliber collection and find the next watch worthy of your shelf, wrist, and long-term rotation.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a routerLink="/watches" class="rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#0F3D2E] shadow-[0_16px_30px_rgba(0,0,0,0.12)] hover:bg-[#F3FBF8]">
              Explore Collection
            </a>
            <a routerLink="/brands" class="rounded-full border border-[#d7ebe4]/35 px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#f7fffb] hover:bg-white hover:text-[#0F3D2E]">
              Browse Brands
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AboutPageComponent {
  readonly stats = [
    { label: 'Timepieces Curated', value: '5,000+' },
    { label: 'Partner Brands', value: '45+' },
    { label: 'Collectors Served', value: '12k+' },
    { label: 'Years of Trust', value: '14' }
  ];

  readonly pillars = [
    {
      label: '01',
      title: 'Curated Selection',
      description: 'We prioritize enduring references, balanced assortments, and watches with strong long-term appeal.'
    },
    {
      label: '02',
      title: 'Collector Guidance',
      description: 'Every product presentation is designed to help buyers compare, evaluate, and choose with confidence.'
    },
    {
      label: '03',
      title: 'Luxury Fulfillment',
      description: 'From secure checkout to concierge support, the ownership journey is treated with care from start to finish.'
    }
  ];

  readonly timeline = [
    { year: '2010', title: 'The Foundation', description: 'Caliber began with a simple aim: make exceptional watches easier to discover and evaluate.' },
    { year: '2015', title: 'Expanded Reach', description: 'Our curated catalog grew to include global collector favorites across luxury, sport, and modern smart categories.' },
    { year: '2019', title: 'Digital Refinement', description: 'We invested in richer product presentation, sharper specifications, and a more considered buying experience.' },
    { year: '2024', title: 'Caliber Online', description: 'The platform evolved into a premium digital showroom for clients who want elegance without noise.' }
  ];
}
