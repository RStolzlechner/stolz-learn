import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationComponent } from './ui/confirmation.component';
import { ConfirmationService } from './services/confirmation.service';
import { StatusMessageComponent } from './ui/status-message.component';
import { StatusMessageService } from './services/status-message.service';
import { TestHttpService } from './services/http/test-http.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmationComponent, StatusMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly statusMessageService = inject(StatusMessageService);
  private readonly testHttpService = inject(TestHttpService);

  protected breadcrumbValues = signal([
    'Breadcrumb not implemented',
    'Use routing service after routing is done',
  ]);

  routeToHome() {
    console.warn('Route To Home currently not implemented');
  }

  openConfirmation() {
    this.confirmationService.open({
      text: 'This is only a test',
      isDanger: true,
      action: () => console.log('confirmed'),
    });
  }

  infoMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an info message',
      type: 'info',
    });
  }

  successMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an success message',
      type: 'success',
    });
  }

  warningMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an warning message',
      type: 'warning',
    });
  }

  errorMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an error message',
      type: 'error',
    });
  }

  testApi() {
    this.testHttpService.test().subscribe((r) => console.log(r));
  }
}
