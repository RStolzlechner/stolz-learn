import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
export class AppComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      console.log(params.get('course-id'));
    });
  }
  private readonly routingService = inject(RoutingService);

  protected breadcrumbValues = signal([
    'Breadcrumb not implemented',
    'Use routing service after routing is done',
  ]);

  async routeToHome() {
    await this.routingService.toQuestionnaireSubmit(1);
  }
}
