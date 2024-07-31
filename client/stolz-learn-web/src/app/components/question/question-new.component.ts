import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { ButtonLabels } from '../../translations/button.translations';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { GUID } from '../../types/guid.type';
import { DateTime } from '../../types/date-time.type';
import { QuestionsLabels } from '../../translations/questions.translations';

@Component({
  selector: 'app-question-new',
  template: `<form [formGroup]="questionsForm">
    <div class="text-caption">{{ QuestionsLabels.newQuestionHeader }}</div>
    <div class="text-secondary">
      {{ QuestionsLabels.newQuestionDescription }}
    </div>
    <div class="mt-4">
      <input
        #numberInput
        class="w-percent-90"
        formControlName="question"
        [placeholder]="QuestionsLabels.questionLabel"
      />
    </div>
    <div class="mt-2">
      <textarea
        class="w-percent-90 h-8"
        formControlName="answer"
        [placeholder]="QuestionsLabels.answerLabel"
      ></textarea>
    </div>
    <div class="mt-4">
      <button
        class="button-primary"
        [disabled]="!questionsForm.valid"
        (click)="onSave()"
      >
        <i class="icon icon-save"></i>
        <span class="ml-2"> {{ buttonLabels.save }}</span>
      </button>
      <button class="button-secondary ml-3" type="button" (click)="onCancel()">
        <i class="icon icon-times"></i>
        <span class="ml-2"> {{ buttonLabels.cancel }}</span>
      </button>
    </div>
  </form>`,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class QuestionNewComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly questionService = inject(QuestionService);
  private readonly formBuilder = inject(FormBuilder);

  protected questionsForm!: FormGroup;

  protected readonly buttonLabels = ButtonLabels;

  ngOnInit() {
    this.routingService.setBreadCrumb(3, BreadcrumbLabels.newLabel);
    this.questionsForm = this.formBuilder.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  async onSave() {
    const courseId = this.routingService.courseId();
    if (!courseId) {
      console.error('QuestionNewComponent::onSave courseId unkown');
      return;
    }

    await this.questionService.createQuestion({
      id: GUID.empty,
      courseId,
      number: 0,
      questionText: this.questionsForm.value.question,
      correctAnswer: this.questionsForm.value.answer,
      dateCreate: DateTime.now(),
      deleted: false,
    });

    await this.routingService.toQuestionOverview();
  }

  async onCancel() {
    await this.routingService.toQuestionOverview();
  }

  protected readonly QuestionsLabels = QuestionsLabels;
}
