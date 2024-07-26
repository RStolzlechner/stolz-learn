import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-questionnaire-statistics',
  template: `<div>Hi From Questionnaire Statistics</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionnaireStatisticsComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(3, BreadcrumbLabels.statistics);
  }
}
