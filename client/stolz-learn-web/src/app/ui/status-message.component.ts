import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusMessageService } from '../services/status-message.service';

@Component({
  selector: 'app-status-message',
  template: ` @if (messages(); as messages) {
    <div class="status-container">
      @for (message of messages; track message) {
        <div class="status-message" [class]="message.bgClass">
          {{ message.message }}
        </div>
      }
    </div>
  }`,
  standalone: true,
  imports: [CommonModule],
})
export class StatusMessageComponent {
  private statusMessageService = inject(StatusMessageService);

  protected messages = computed(() => {
    const ms = this.statusMessageService.messages();
    return ms.map((m) => {
      let bgClass = 'bg-surface-3';
      if (m.type === 'success') bgClass = 'bg-success';
      else if (m.type === 'warning') bgClass = 'bg-warning';
      else if (m.type === 'error') bgClass = 'bg-danger';
      return { ...m, bgClass };
    });
  });
}
