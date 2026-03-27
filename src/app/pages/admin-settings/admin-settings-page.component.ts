import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="mx-auto max-w-5xl px-6 py-16">
      <p class="text-sm uppercase tracking-[0.45em] text-[#6b7280]">Admin / Settings</p>
      <h1 class="mt-4 font-display text-5xl text-[#111111]">App Settings</h1>
      <form class="mt-10 grid gap-6 rounded-[2rem] border border-[#d8dde3] bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.04)]">
        <input [(ngModel)]="settings.storeName" name="storeName" placeholder="Store name" class="rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-5 py-4 text-[#111111]">
        <input [(ngModel)]="settings.supportEmail" name="supportEmail" placeholder="Support email" class="rounded-[1rem] border border-[#d8dde3] bg-[#f8fafc] px-5 py-4 text-[#111111]">
        <label class="flex items-center justify-between rounded-[1rem] border border-[#d8dde3] px-5 py-4 text-[#111111]"><span>Email notifications</span><input [(ngModel)]="settings.emailNotifications" name="emailNotifications" type="checkbox" class="h-4 w-4 accent-[#111111]"></label>
        <label class="flex items-center justify-between rounded-[1rem] border border-[#d8dde3] px-5 py-4 text-[#111111]"><span>Auto-order confirmation</span><input [(ngModel)]="settings.autoConfirm" name="autoConfirm" type="checkbox" class="h-4 w-4 accent-[#111111]"></label>
        <label class="flex items-center justify-between rounded-[1rem] border border-[#d8dde3] px-5 py-4 text-[#111111]"><span>Maintenance mode</span><input [(ngModel)]="settings.maintenanceMode" name="maintenanceMode" type="checkbox" class="h-4 w-4 accent-[#111111]"></label>
        <button type="button" class="rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#303030]">Save Settings</button>
      </form>
    </section>
  `
})
export class AdminSettingsPageComponent {
  settings = {
    storeName: 'Caliber Watch Store',
    supportEmail: 'atelier@caliber.store',
    emailNotifications: true,
    autoConfirm: true,
    maintenanceMode: false
  };
}
