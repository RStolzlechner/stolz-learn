import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationComponent } from './components/dialogs/confirmation.component';
import { StatusMessageComponent } from './components/dialogs/status-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmationComponent, StatusMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected breadcrumbValues = signal([
    'Breadcrumb not implemented',
    'Use routing service after routing is done',
  ]);

  routeToHome() {
    console.warn('Route To Home currently not implemented');
  }
}
