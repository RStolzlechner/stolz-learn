import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationComponent } from './components/dialogs/confirmation.component';
import { StatusMessageComponent } from './components/dialogs/status-message.component';
import { RoutingService } from './services/routing.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmationComponent, StatusMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly routingService = inject(RoutingService);

  protected breadcrumbValues = this.routingService.breadcrumb;

  async routeToHome() {
    await this.routingService.toCoursesOverview();
  }
}
