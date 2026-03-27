import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-watch-stage',
  standalone: true,
  template: `
    <div
      class="group relative overflow-hidden rounded-[2.5rem] border border-[#E5E5E5] bg-[linear-gradient(180deg,#ffffff,#f6f8f7)] shadow-[0_35px_90px_rgba(17,17,17,0.08)]"
      (mousemove)="onPointerMove($event)"
      (mouseleave)="resetTilt()"
    >
      <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(15,61,46,0.18))]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,122,99,0.18),transparent_20%),radial-gradient(circle_at_82%_28%,rgba(15,61,46,0.18),transparent_28%)]"></div>
      <div class="absolute left-[10%] top-[8%] h-36 w-36 rounded-full border border-[#B8D5CC] bg-[#E8F4F0] blur-3xl"></div>

      <div class="relative h-[560px] w-full transition duration-500" [style.transform]="stageTransform()">
        <video
          class="absolute inset-0 h-full w-full object-cover object-center opacity-85 transition duration-700 group-hover:scale-[1.04]"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
        >
          <source src="assets/images/omega-seamaster.webm" type="video/webm">
        </video>
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(15,61,46,0.2))]"></div>
      </div>
    </div>
  `
})
export class WatchStageComponent {
  readonly stageTransform = signal('perspective(1400px) rotateX(-2deg) rotateY(4deg) scale3d(1, 1, 1)');

  onPointerMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

    const rotateX = -(normalizedY * 7 + 1.5);
    const rotateY = normalizedX * 9 + 4;
    this.stageTransform.set(`perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
  }

  resetTilt(): void {
    this.stageTransform.set('perspective(1400px) rotateX(-2deg) rotateY(4deg) scale3d(1, 1, 1)');
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.resetTilt();
  }
}
