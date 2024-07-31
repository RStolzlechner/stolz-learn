import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { QuestionsLabels } from '../../translations/questions.translations';

@Component({
  selector: 'app-questionnaire-submit',
  template: `@if (question(); as question) {
    <div class="text-caption ml-2 mb-4">{{ question.questionText }}</div>
    <textarea
      class="w-percent-90 h-8"
      [placeholder]="QuestionsLabels.answerLabel"
    ></textarea>
  }`,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionnaireSubmitComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly questionnaireService = inject(QuestionnaireService);

  protected readonly question = this.questionnaireService.question;

  ngOnInit() {
    const step = this.questionnaireService.step();
    const allSteps = this.questionnaireService.allSteps();

    this.routingService.setBreadCrumb(3, `${step + 1} (${allSteps})`);
  }

  protected readonly QuestionsLabels = QuestionsLabels;
}
