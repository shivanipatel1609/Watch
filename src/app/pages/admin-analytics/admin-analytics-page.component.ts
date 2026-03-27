import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-analytics-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto max-w-7xl px-6 py-16">
      <p class="text-sm uppercase tracking-[0.45em] text-[#6b7280]">Admin / Analytics</p>
      <h1 class="mt-4 font-display text-5xl text-[#111111]">Sales Analytics</h1>
      <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_12px_24px_rgba(0,0,0,0.04)]"><p class="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Total Users</p><p class="mt-3 text-4xl text-[#111111]">1,284</p></div>
        <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_12px_24px_rgba(0,0,0,0.04)]"><p class="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Total Orders</p><p class="mt-3 text-4xl text-[#111111]">642</p></div>
        <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_12px_24px_rgba(0,0,0,0.04)]"><p class="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Revenue</p><p class="mt-3 text-4xl text-[#111111]">₹284K</p></div>
        <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_12px_24px_rgba(0,0,0,0.04)]"><p class="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Avg Order</p><p class="mt-3 text-4xl text-[#111111]">₹442</p></div>
      </div>
      <div class="mt-10 rounded-[2rem] border border-[#d4d4d4] bg-white p-8 shadow-[0_16px_30px_rgba(0,0,0,0.04)]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-[#6b7280]">Monthly Trend</p>
            <p class="mt-3 text-3xl text-[#111111]">₹284K</p>
            <p class="mt-2 text-sm text-[#6b7280]">Revenue performance across the last six months.</p>
          </div>
          <div class="rounded-full border border-[#d4d4d4] bg-[#fafafa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">
            Peak {{ highestMonth.label }}
          </div>
        </div>

        <div class="mt-8 rounded-[1.75rem] border border-[#ececec] bg-[linear-gradient(180deg,#ffffff_0%,#f8f8f8_100%)] p-6">
          <div class="relative h-80">
            <div class="absolute inset-0 flex flex-col justify-between pb-10">
              @for (line of chartGuideLines; track line) {
                <div class="border-t border-dashed border-[#e5e5e5]"></div>
              }
            </div>

            <div class="absolute bottom-10 left-0 right-0 border-t border-[#cfcfcf]"></div>

            <div class="relative flex h-full items-end gap-4">
              @for (item of monthlyTrend; track item.label) {
                <div class="flex h-full flex-1 flex-col justify-end">
                  <div class="flex h-full flex-col justify-end">
                    <p class="mb-3 text-center text-xs font-medium text-[#7a7a7a]">₹{{ item.value }}K</p>
                    <div
                      class="mx-auto w-full max-w-[7rem] rounded-t-[1.2rem] bg-gradient-to-t from-[#111111] via-[#484848] to-[#b8c2cf] shadow-[0_14px_24px_rgba(0,0,0,0.12)]"
                      [style.height.%]="item.height"
                    ></div>
                  </div>
                  <p class="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">{{ item.label }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminAnalyticsPageComponent {
  readonly chartGuideLines = [1, 2, 3, 4];
  readonly monthlyTrend = [
    { label: 'Jan', value: 148, height: 52 },
    { label: 'Feb', value: 186, height: 65 },
    { label: 'Mar', value: 201, height: 70 },
    { label: 'Apr', value: 252, height: 88 },
    { label: 'May', value: 232, height: 81 },
    { label: 'Jun', value: 284, height: 96 }
  ];

  get highestMonth() {
    return this.monthlyTrend.reduce((peak, current) => (current.value > peak.value ? current : peak), this.monthlyTrend[0]);
  }
}
