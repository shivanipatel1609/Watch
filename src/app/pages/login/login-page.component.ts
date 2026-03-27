import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-12 lg:py-16">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(31,122,99,0.06),transparent_20%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_52%,#f4f8f6_100%)]"></div>

      <div class="relative mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-[2.25rem] border border-[#E5E5E5] bg-white p-10 shadow-[0_24px_60px_rgba(17,17,17,0.05)]">
          <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#0F7A63]">Client Access</p>
          <h1 class="mt-6 font-display text-5xl leading-[0.92] text-[#111111] md:text-[5.2rem]">
            Enter the
            <br>
            Caliber
            <br>
            showroom
          </h1>
          <p class="mt-8 max-w-xl text-lg leading-9 text-[#111111]/68">
            Sign in with your email account to access orders, wishlist, and your private Caliber profile.
          </p>
        </div>

        <div class="rounded-[2.25rem] border border-[#E5E5E5] bg-white p-10 shadow-[0_24px_60px_rgba(17,17,17,0.05)]">
          <form class="grid gap-8" (ngSubmit)="submit()">
            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.32em] text-[#0F7A63]">Email</label>
              <input
                [(ngModel)]="form.email"
                name="email"
                type="email"
                placeholder="collector@caliber.store"
                class="mt-6 w-full rounded-[1.6rem] border border-[#E5E5E5] bg-[#FCFCFC] px-6 py-5 text-[1.1rem] text-[#111111] outline-none placeholder:text-[#94A3B8]"
                required
              >
            </div>

            @if (otpRequested()) {
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.32em] text-[#0F7A63]">Email OTP</label>
                <div class="mt-6" data-otp-container (paste)="onOtpPaste($event)">
                  <input [(ngModel)]="form.otp" name="otp" type="hidden" required>
                  <div class="grid grid-cols-6 gap-3 md:gap-4">
                    @for (slot of otpSlots; track slot) {
                      <input
                        [value]="otpDigitAt(slot)"
                        type="text"
                        inputmode="numeric"
                        maxlength="1"
                        autocomplete="one-time-code"
                        data-otp-digit
                        class="h-16 w-full rounded-[1.2rem] border border-[#E5E5E5] bg-[#FCFCFC] text-center text-2xl font-semibold text-[#111111] outline-none focus:border-[#0F7A63] focus:bg-white"
                        (input)="onOtpInput($event, slot)"
                        (keydown)="onOtpKeydown($event, slot)"
                      >
                    }
                  </div>
                  <p class="mt-3 text-sm text-[#94A3B8]">Enter the 6-digit OTP</p>
                </div>
              </div>
            }

            @if (errorMessage()) {
              <div class="rounded-[1.2rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {{ errorMessage() }}
              </div>
            }

            @if (successMessage()) {
              <div class="rounded-[1.2rem] border border-[#CDE5DE] bg-[#F3FBF8] px-5 py-4 text-sm text-[#0F3D2E]">
                {{ successMessage() }}
              </div>
            }

            <button
              type="submit"
              [disabled]="isSubmitting()"
              class="rounded-full bg-[#114734] px-6 py-5 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#0F3D2E] disabled:cursor-not-allowed disabled:bg-[#114734]/65"
            >
              {{ submitLabel() }}
            </button>

            @if (otpRequested()) {
              <button
                type="button"
                (click)="sendOtp()"
                [disabled]="isSubmitting()"
                class="justify-self-start text-sm font-semibold uppercase tracking-[0.18em] text-[#0F7A63] hover:text-[#0F3D2E] disabled:cursor-not-allowed disabled:text-[#0F7A63]/50"
              >
                Resend OTP
              </button>
            }
          </form>

          <p class="mt-10 text-sm text-[#111111]/64">
            New to Caliber?
            <a routerLink="/register" class="font-semibold text-[#0F7A63]">Create an account</a>
          </p>
        </div>
      </div>
    </section>
  `
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly otpSlots = [0, 1, 2, 3, 4, 5];

  readonly otpRequested = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = {
    email: '',
    otp: ''
  };

  async submit(): Promise<void> {
    if (this.otpRequested()) {
      await this.verifyOtp();
      return;
    }

    await this.sendOtp();
  }

  async sendOtp(): Promise<void> {
    try {
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');
      await this.authService.requestEmailOtp(this.form.email, 'login');
      this.otpRequested.set(true);
      this.setOtpValue('');
      this.successMessage.set('OTP sent successfully. Check your email.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to send OTP right now.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async verifyOtp(): Promise<void> {
    try {
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');
      await this.authService.verifyEmailOtp(this.form.email, this.form.otp, 'login');
      void this.router.navigate(['/']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to verify OTP right now.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  submitLabel(): string {
    if (this.isSubmitting()) {
      return this.otpRequested() ? 'Verifying...' : 'Sending...';
    }

    return this.otpRequested() ? 'Verify OTP' : 'Send OTP';
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
