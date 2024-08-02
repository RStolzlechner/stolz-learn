import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { QuestionsLabels } from '../../translations/questions.translations';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonLabels } from '../../translations/button.translations';

@Component({
  selector: 'app-questionnaire-submit',
  template: `@if (question(); as question) {
    <form>
      <div class="text-caption ml-2 mb-3">{{ question.questionText }}</div>
      <div>
        <textarea
          [formControl]="answerForm"
          class="w-percent-90 h-8"
          [placeholder]="QuestionsLabels.answerLabel"
        ></textarea>
      </div>
      <div>
        <button
          class="button-primary mt-4 ml-3"
          [disabled]="!answerForm.valid"
          (click)="onNext()"
        >
          <i class="icon icon-next"></i>
          {{ ButtonLabels.next }}
        </button>
      </div>
    </form>
  }`,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class QuestionnaireSubmitComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly questionnaireService = inject(QuestionnaireService);

  protected answerForm = new FormControl('', [Validators.required]);

  protected readonly question = this.questionnaireService.question;

  ngOnInit() {
    const step = this.questionnaireService.step();
    const allSteps = this.questionnaireService.allSteps();

    this.routingService.setBreadCrumb(3, `${step + 1} (${allSteps})`);
  }

  protected readonly QuestionsLabels = QuestionsLabels;
  protected readonly ButtonLabels = ButtonLabels;

  async onNext() {
    const answer = this.answerForm.value;
    if (!answer) {
      console.error('Answer is required');
      return;
    }

    this.questionnaireService.giveAnswer(answer);
    await this.routingService.toQuestionnaireEvaluate(
      this.questionnaireService.step() + 1,
    );
  }
}
