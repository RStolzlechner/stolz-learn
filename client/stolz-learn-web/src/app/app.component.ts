import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationComponent } from './ui/confirmation.component';
import { ConfirmationService } from './services/confirmation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly confirmationService = inject(ConfirmationService);

  protected breadcrumbValues = signal([
    'Breadcrumb not implemented',
    'Use routing service after routing is done',
  ]);

  routeToHome() {
    console.warn('Route To Home currently not implemented');
  }

  popover = viewChild.required<ElementRef>('confirmation-popover');

  openConfirmation() {
    this.confirmationService.open({
      text: 'This is only a test',
      isDanger: true,
      action: () => console.log('confirmed'),
    });
  }
}
