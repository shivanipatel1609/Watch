import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WatchService } from '../../services/watch.service';

type ChatRole = 'bot' | 'user';

interface ChatMessage {
  role: ChatRole;
  text: string;
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fixed bottom-6 right-6 z-50">
      @if (open()) {
        <section class="mb-4 flex h-[38rem] w-[24rem] flex-col overflow-hidden rounded-[2rem] border border-[#d9e4df] bg-white shadow-[0_30px_80px_rgba(15,61,46,0.18)] sm:w-[28rem]">
          <div class="bg-[linear-gradient(135deg,#114734_0%,#1f7a63_100%)] px-5 py-4 text-white">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Caliber AI</p>
                <h3 class="mt-2 font-display text-2xl">Shopping Assistant</h3>
                <p class="mt-2 text-sm leading-6 text-white/80">Ask about watches, cart, delivery, login, or recommendations.</p>
              </div>
              <button type="button" (click)="toggle()" class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-[#114734]">
                Close
              </button>
            </div>
          </div>

          <div class="border-b border-[#edf2ef] px-5 py-3">
            <div class="flex flex-wrap gap-2">
              @for (prompt of quickPrompts; track prompt) {
                <button type="button" (click)="usePrompt(prompt)" class="rounded-full border border-[#d9e4df] bg-[#f7fbf9] px-3 py-2 text-xs font-semibold text-[#114734] hover:border-[#114734]">
                  {{ prompt }}
                </button>
              }
            </div>
          </div>

          <div class="flex-1 space-y-4 overflow-y-auto bg-[#fbfcfc] px-5 py-4">
            @for (message of messages(); track $index) {
              <div class="flex" [class.justify-end]="message.role === 'user'">
                <div
                  class="max-w-[90%] rounded-[1.4rem] px-4 py-3 text-sm leading-6 shadow-[0_10px_24px_rgba(17,17,17,0.04)]"
                  [class.bg-white]="message.role === 'bot'"
                  [class.border]="message.role === 'bot'"
                  [class.border-[#e5ece8]]="message.role === 'bot'"
                  [class.text-[#111111]]="message.role === 'bot'"
                  [class.bg-[#114734]]="message.role === 'user'"
                  [class.text-white]="message.role === 'user'"
                >
                  {{ message.text }}
                </div>
              </div>
            }
          </div>

          <div class="border-t border-[#edf2ef] bg-white p-4">
            <form class="space-y-3" (ngSubmit)="sendMessage()">
              <textarea
                [(ngModel)]="draft"
                name="draft"
                rows="2"
                placeholder="Ask Caliber AI anything..."
                class="w-full resize-none rounded-[1.25rem] border border-[#d9e4df] bg-[#fbfcfc] px-4 py-3 text-sm text-[#111111] outline-none placeholder:text-[#7c8b84]"
              ></textarea>
              <div class="flex items-center justify-between gap-3">
                <a routerLink="/catalog" class="text-xs font-semibold uppercase tracking-[0.18em] text-[#114734] hover:text-[#0f3d2e]">
                  Open Catalog
                </a>
                <button type="submit" class="rounded-full bg-[#114734] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#0f3d2e]">
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>
      }

      <button
        type="button"
        (click)="toggle()"
        class="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#114734_0%,#1f7a63_100%)] text-white shadow-[0_24px_44px_rgba(15,61,46,0.24)] hover:scale-[1.02]"
        aria-label="Open AI chatbot"
      >
        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path>
          <path d="M8 10h8"></path>
          <path d="M8 14h5"></path>
        </svg>
      </button>
    </div>
  `
})
export class AiChatbotComponent {
  private readonly watchService = inject(WatchService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  readonly open = signal(false);
  readonly messages = signal<ChatMessage[]>([
    {
      role: 'bot',
      text: 'Hello. I can help you find watches, explain delivery, check cart status, and guide login or registration.'
    }
  ]);
  readonly quickPrompts = [
    'Recommend a luxury watch',
    'What is in my cart?',
    'How does delivery work?',
    'How do I login with OTP?'
  ];

  draft = '';
  readonly featuredReply = computed(() => {
    const watches = this.watchService.getFeatured().slice(0, 3);
    if (!watches.length) {
      return 'I can help you browse the catalog and compare watches.';
    }

    return `Top picks right now: ${watches.map((watch) => `${watch.brand} ${watch.name}`).join(', ')}.`;
  });

  toggle(): void {
    this.open.set(!this.open());
  }

  usePrompt(prompt: string): void {
    this.draft = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    const value = this.draft.trim();
    if (!value) {
      return;
    }

    this.messages.update((messages) => [...messages, { role: 'user', text: value }]);
    this.messages.update((messages) => [...messages, { role: 'bot', text: this.buildReply(value) }]);
    this.draft = '';
  }

  private buildReply(question: string): string {
    const normalized = question.toLowerCase();

    if (normalized.includes('cart')) {
      const items = this.cartService.items();
      if (!items.length) {
        return 'Your cart is currently empty. Open the catalog to add a watch, and I can help you compare options.';
      }

      return `You have ${items.length} item(s) in cart with a total of ₹${Math.round(this.cartService.total()).toLocaleString()}. Items: ${items.map((item) => `${item.watch.name} x${item.quantity}`).join(', ')}.`;
    }

    if (normalized.includes('recommend') || normalized.includes('best') || normalized.includes('suggest')) {
      return `${this.featuredReply()} If you want, ask by brand, budget, or category like sport, luxury, or smart.`;
    }

    if (normalized.includes('delivery') || normalized.includes('shipping') || normalized.includes('return')) {
      return 'Caliber supports insured delivery and guided checkout. You can also check the Shipping & Returns page for full details, including return guidance and transit support.';
    }

    if (normalized.includes('login') || normalized.includes('otp') || normalized.includes('register') || normalized.includes('sign in')) {
      return 'Use your email to request a 6-digit OTP, then enter it to sign in or register. Registration also creates your collector profile for dashboard, wishlist, and order tracking.';
    }

    if (normalized.includes('wishlist')) {
      const count = this.authService.getWishlist().length;
      return count
        ? `You currently have ${count} watch(es) in your wishlist. You can review them from your account and move any of them into cart.`
        : 'Your wishlist is currently empty. Save any watch you like from the product pages after signing in.';
    }

    if (normalized.includes('account') || normalized.includes('profile')) {
      return this.authService.isAuthenticated()
        ? `You are signed in as ${this.authService.user()?.name || 'a Caliber client'}. You can access dashboard, wishlist, and order tracking from your account.`
        : 'You are not signed in right now. Use email OTP login to access your account, wishlist, and tracked orders.';
    }

    const matched = this.watchService.search(question).slice(0, 3);
    if (matched.length) {
      return `I found these matching watches: ${matched.map((watch) => `${watch.brand} ${watch.name} for ₹${watch.price.toLocaleString()}`).join(', ')}.`;
    }

    return 'I can help with product recommendations, cart questions, shipping, OTP login, account access, and catalog search. Try asking for a brand, budget, or watch style.';
  }
}
