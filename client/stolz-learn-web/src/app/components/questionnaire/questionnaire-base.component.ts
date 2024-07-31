import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { QuestionnaireLabels } from '../../translations/questionnaire.translations';

@Component({
  selector: 'app-questionnaire-base',
  template: `<router-outlet />`,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class QuestionnaireBaseComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly questionnaireService = inject(QuestionnaireService);

  protected readonly QuestionnaireLabels = QuestionnaireLabels;

  async ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.questionnaire);

    const allSteps = this.questionnaireService.allSteps();
    if (allSteps <= 0) {
      await this.routingService.toCoursesOverview();
    }
  }
}
