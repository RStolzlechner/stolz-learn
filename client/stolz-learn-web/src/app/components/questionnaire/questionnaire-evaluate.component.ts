import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { QuestionsLabels } from '../../translations/questions.translations';
import { ButtonLabels } from '../../translations/button.translations';

@Component({
  selector: 'app-questionnaire-evaluate',
  template: `@if (question(); as question) {
    <form>
      <div class="text-caption ml-2 mb-3">{{ question.questionText }}</div>
      <div>
        <div class="mr-2">Given answer</div>
        <textarea [disabled]="true" class="w-percent-90 h-8">{{
          answer().givenAnswer
        }}</textarea>
        <div class="mt-2 mr-2">Correct answer</div>
        <textarea [disabled]="true" class="w-percent-90 h-8">{{
          question.questionText
        }}</textarea>
      </div>
      <div>
        <button class="button-primary mt-4 ml-3" (click)="onNext(true)">
          {{ ButtonLabels.correct }}
        </button>
        <button class="button-secondary mt-4 ml-3" (click)="onNext(false)">
          {{ ButtonLabels.incorrect }}
        </button>
      </div>
    </form>
  }`,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class QuestionnaireEvaluateComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly questionnaireService = inject(QuestionnaireService);

  protected readonly question = this.questionnaireService.question;
  protected readonly answer = this.questionnaireService.answer;

  ngOnInit() {
    const step = this.questionnaireService.step();
    const allSteps = this.questionnaireService.allSteps();

    this.routingService.setBreadCrumb(3, `${step + 1} (${allSteps})`);
  }

  protected readonly ButtonLabels = ButtonLabels;

  async onNext(correct: boolean) {
    this.questionnaireService.evaluateAnswer(correct);

    const hasNext = this.questionnaireService.hasNext();

    if (!hasNext) {
      await this.questionnaireService.end();
      await this.routingService.toQuestionnaireStatistics();
    } else {
      await this.routingService.toQuestionnaireSubmit(
        this.questionnaireService.step() + 1,
      );
    }
  }
}
