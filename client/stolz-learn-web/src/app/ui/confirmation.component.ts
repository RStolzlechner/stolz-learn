import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../services/confirmation.service';
import { ConfirmationLabels } from '../translations/confirmation.translations';

@Component({
  selector: 'app-confirmation-dialog',
  template: `<dialog #confirmDialog (keydown.escape)="close()" tabindex="1">
    @if (confirmationData(); as confirmationData) {
      <div>{{ confirmationData.text }}</div>
      <div class="flex mt-3">
        <button
          type="submit"
          class="button-primary w-6"
          [ngClass]="{ 'button-danger': confirmationData.isDanger }"
          (click)="confirm()"
        >
          {{ ConfirmationLabels.YES }}
        </button>
        <button class="button-secondary w-6 ml-3" (click)="close()">
          {{ ConfirmationLabels.NO }}
        </button>
      </div>
    }
  </dialog>`,
  standalone: true,
  imports: [CommonModule],
})
export class ConfirmationComponent {
  private readonly confirmationService = inject(ConfirmationService);

  private dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('confirmDialog');

  protected ConfirmationLabels = ConfirmationLabels;

  protected confirmationData = this.confirmationService.confirmationData;

  constructor() {
    effect(
      () => {
        if (this.confirmationService.isOpened()) this.open();
        else this.close();
      },
      { allowSignalWrites: true },
    );
  }

  public open() {
    this.dialog().nativeElement.showModal();
  }

  public close() {
    this.confirmationService.close();
    this.dialog().nativeElement.close();
  }

  protected confirm() {
    this.confirmationData().action();
    this.close();
  }
}
