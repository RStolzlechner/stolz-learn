import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { QuestionnaireLabels } from '../../translations/questionnaire.translations';
import { ButtonLabels } from '../../translations/button.translations';

@Component({
  selector: 'app-questionnaire-statistics',
  template: `@if (statistics(); as statistics) {
      <div>
        {{
          QuestionnaireLabels.questionnaireStatistics(
            correct(),
            allSteps(),
            percentage()
          )
        }}
      </div>
    } @else {
      <div>{{ QuestionnaireLabels.statisticsAreLoading }}</div>
    }
    <button class="button-primary ml-2 mt-4" (click)="onBack()">
      <i class="icon icon-back"></i> <span>{{ ButtonLabels.back }}</span>
    </button> `,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionnaireStatisticsComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly questionnaireService = inject(QuestionnaireService);

  //todo implement statistics
  protected statistics = this.questionnaireService.statistics;

  //quick statistics
  protected allSteps = this.questionnaireService.allSteps;
  protected correct = computed(() => {
    const all = this.questionnaireService.answers();
    return all.filter((a) => a.isCorrect).length;
  });
  protected percentage = computed(() => {
    const all = this.questionnaireService.answers();
    return (this.correct() / all.length) * 100;
  });

  ngOnInit() {
    this.routingService.setBreadCrumb(3, BreadcrumbLabels.statistics);
  }

  protected readonly QuestionnaireLabels = QuestionnaireLabels;
  protected readonly ButtonLabels = ButtonLabels;

  async onBack() {
    await this.routingService.toCourse();
  }
}
