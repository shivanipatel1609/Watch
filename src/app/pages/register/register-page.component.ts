import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,61,46,0.08),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_56%,#f9f9f9_100%)]"></div>
      <div class="relative mx-auto max-w-5xl rounded-[2.25rem] border border-[#E5E5E5] bg-white p-10 shadow-[0_24px_55px_rgba(17,17,17,0.05)] lg:p-12">
        <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#1F7A63]">Register</p>
        <h1 class="mt-6 font-display text-5xl leading-tight text-[#111111] md:text-6xl">Create your collector profile</h1>
        <p class="mt-6 max-w-3xl text-lg leading-9 text-[#111111]/66">
          Build your account for wishlists, order tracking, curated releases, and a more personal Caliber experience.
        </p>

        <form class="mt-10 grid gap-6 md:grid-cols-2" (ngSubmit)="submit()">
          <div>
            <label class="mb-3 block text-xs font-semibold uppercase tracking-[0.32em] text-[#1F7A63]">Full Name</label>
            <input
              [(ngModel)]="form.name"
              name="name"
              placeholder="Full name"
              class="w-full rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none placeholder:text-[#111111]/40"
              required
            >
          </div>

          <div>
            <label class="mb-3 block text-xs font-semibold uppercase tracking-[0.32em] text-[#1F7A63]">Email</label>
            <input
              [(ngModel)]="form.email"
              name="email"
              type="email"
              placeholder="Email address"
              class="w-full rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none placeholder:text-[#111111]/40"
              required
            >
          </div>

          <div>
            <label class="mb-3 block text-xs font-semibold uppercase tracking-[0.32em] text-[#1F7A63]">Phone</label>
            <input
              [(ngModel)]="form.phone"
              name="phone"
              type="tel"
              placeholder="Mobile number"
              class="w-full rounded-[1.2rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none placeholder:text-[#111111]/40"
              required
            >
          </div>

          @if (otpRequested()) {
            <div>
              <label class="mb-3 block text-xs font-semibold uppercase tracking-[0.32em] text-[#1F7A63]">Email OTP</label>
              <div data-otp-container (paste)="onOtpPaste($event)">
                <input [(ngModel)]="form.otp" name="otp" type="hidden" required>
                <div class="grid grid-cols-6 gap-3">
                  @for (slot of otpSlots; track slot) {
                    <input
                      [value]="otpDigitAt(slot)"
                      type="text"
                      inputmode="numeric"
                      maxlength="1"
                      autocomplete="one-time-code"
                      data-otp-digit
                      class="h-14 w-full rounded-[1rem] border border-[#E5E5E5] bg-[#F9F9F9] text-center text-xl font-semibold text-[#111111] outline-none focus:border-[#1F7A63] focus:bg-white"
                      (input)="onOtpInput($event, slot)"
                      (keydown)="onOtpKeydown($event, slot)"
                    >
                  }
                </div>
                <p class="mt-3 text-sm text-[#111111]/40">Enter the 6-digit OTP</p>
              </div>
            </div>
          }

          @if (errorMessage()) {
            <div class="md:col-span-2 rounded-[1rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {{ errorMessage() }}
            </div>
          }

          @if (successMessage()) {
            <div class="md:col-span-2 rounded-[1rem] border border-[#CDE5DE] bg-[#F3FBF8] px-5 py-4 text-sm text-[#0F3D2E]">
              {{ successMessage() }}
            </div>
          }

          <div class="md:col-span-2 flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" class="rounded-full bg-[#0F3D2E] px-7 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-white transition hover:bg-[#1F7A63]">
              {{ otpRequested() ? 'Verify OTP & Create Account' : 'Send OTP' }}
            </button>
            @if (otpRequested()) {
              <button type="button" (click)="sendOtp()" class="text-sm font-semibold uppercase tracking-[0.24em] text-[#111111]/60 transition hover:text-[#0F3D2E]">
                Resend OTP
              </button>
            }
            <a routerLink="/login" class="text-sm font-semibold uppercase tracking-[0.24em] text-[#111111]/60 transition hover:text-[#0F3D2E]">
              Already have an account
            </a>
          </div>
        </form>
      </div>
    </section>
  `
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly otpSlots = [0, 1, 2, 3, 4, 5];

  readonly otpRequested = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = {
    name: '',
    email: '',
    phone: '',
    otp: ''
  };

  async submit(): Promise<void> {
    if (this.otpRequested()) {
      await this.verifyAndRegister();
      return;
    }

    await this.sendOtp();
  }

  async sendOtp(): Promise<void> {
    try {
      this.errorMessage.set('');
      this.successMessage.set('');
      await this.authService.requestEmailOtp(this.form.email, 'register');
      this.otpRequested.set(true);
      this.setOtpValue('');
      this.successMessage.set('OTP sent successfully. Check your email.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to send OTP right now.');
    }
  }

  async verifyAndRegister(): Promise<void> {
    try {
      this.errorMessage.set('');
      this.successMessage.set('');
      await this.authService.verifyEmailOtp(this.form.email, this.form.otp, 'register');
      await this.authService.register({
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone
      });
      void this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to create account right now.');
    }
  }

  otpDigitAt(index: number): string {
    return this.form.otp[index] ?? '';
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    input.value = digit;

    const digits = this.form.otp.padEnd(6).slice(0, 6).split('');
    digits[index] = digit;
    this.setOtpValue(digits.join('').replace(/\s/g, ''));

    if (digit && index < this.otpSlots.length - 1) {
      this.focusOtpInput(input, index + 1);
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const digits = this.form.otp.padEnd(6).slice(0, 6).split('');
      digits[index - 1] = '';
      this.setOtpValue(digits.join('').replace(/\s/g, ''));
      this.focusOtpInput(input, index - 1);
      event.preventDefault();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) ?? '';
    this.setOtpValue(pasted);

    const container = event.currentTarget as HTMLElement;
    const inputs = Array.from(container.querySelectorAll('input[data-otp-digit]')) as HTMLInputElement[];
    inputs.forEach((input, index) => {
      input.value = pasted[index] ?? '';
    });

    const focusIndex = Math.min(Math.max(pasted.length - 1, 0), this.otpSlots.length - 1);
    inputs[focusIndex]?.focus();
  }

  private setOtpValue(value: string): void {
    this.form.otp = value.replace(/\D/g, '').slice(0, 6);
  }

  private focusOtpInput(currentInput: HTMLInputElement, index: number): void {
    const container = currentInput.closest('[data-otp-container]');
    const inputs = container ? Array.from(container.querySelectorAll('input[data-otp-digit]')) as HTMLInputElement[] : [];
    inputs[index]?.focus();
    inputs[index]?.select();
  }
}
