import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-questionnaire-base',
  template: `<router-outlet />`,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class QuestionnaireBaseComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.questionnaire);
  }
}
