import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { QuestionService } from '../../services/question.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonLabels } from '../../translations/button.translations';
import { GUID } from '../../types/guid.type';
import { QuestionsLabels } from '../../translations/questions.translations';
import { QuestionRoutes } from '../../app.routes';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-question-edit',
  template: `<form [formGroup]="questionsForm">
    <div class="text-caption">{{ QuestionsLabels.editQuestionHeader }}</div>
    <div class="text-secondary">
      {{ QuestionsLabels.editQuestionDescription }}
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
    <div class="mt-4 flex justify-between">
      <div>
        <button
          class="button-primary"
          [disabled]="!questionsForm.valid"
          (click)="onSave()"
        >
          <i class="icon icon-save"></i>
          <span class="ml-2"> {{ buttonLabels.save }}</span>
        </button>
        <button
          class="button-secondary ml-3"
          type="button"
          (click)="onCancel()"
        >
          <i class="icon icon-times"></i>
          <span class="ml-2"> {{ buttonLabels.cancel }}</span>
        </button>
      </div>
      <button class="button-danger mr-8" type="button" (click)="onDelete()">
        <i class="icon icon-trash"></i>
        <span class="ml-2"> {{ buttonLabels.deleteLabel }}</span>
      </button>
    </div>
  </form>`,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class QuestionEditComponent implements OnInit, OnDestroy {
  private readonly routingService = inject(RoutingService);
  private readonly route = inject(ActivatedRoute);
  private readonly questionService = inject(QuestionService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly formBuilder = inject(FormBuilder);

  private routeSubscription!: Subscription;

  private questionId?: GUID;

  protected questionsForm!: FormGroup;

  protected readonly QuestionsLabels = QuestionsLabels;
  protected readonly buttonLabels = ButtonLabels;

  constructor() {
    effect(() => {
      if (!this.questionId) return;

      const question = this.questionService
        .questions()
        .find((q) => q.id === this.questionId);

      if (!question) {
        return;
      }

      this.questionsForm.setValue({
        question: question.questionText,
        answer: question.correctAnswer,
      });
    });
  }

  async ngOnInit() {
    this.routingService.setBreadCrumb(3, BreadcrumbLabels.edit);
    this.questionsForm = this.formBuilder.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });

    this.routeSubscription = this.route.paramMap.subscribe(async (pm) => {
      const questionId = pm.get(QuestionRoutes.questionId);
      if (!questionId) return;

      this.questionId = GUID(questionId);
      const question = this.questionService
        .questions()
        .find((q) => q.id === this.questionId);
      if (!question) {
        return;
      }

      this.questionsForm.setValue({
        question: question.questionText,
        answer: question.correctAnswer,
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  async onSave() {
    const courseId = this.routingService.courseId();
    if (!courseId) {
      console.error('QuestionNewComponent::onSave courseId unknown');
      return;
    }

    if (!this.questionId) {
      console.error('QuestionNewComponent::onSave questionId unknown');
      return;
    }

    const question = this.questionService
      .questions()
      .find((q) => q.id === this.questionId);
    if (!question) {
      console.error('QuestionNewComponent::onSave question unknown');
      return;
    }

    await this.questionService.updateQuestion({
      ...question,
      questionText: this.questionsForm.value.question,
      correctAnswer: this.questionsForm.value.answer,
    });

    await this.routingService.toQuestionOverview();
  }

  async onCancel() {
    await this.routingService.toQuestionOverview();
  }

  onDelete() {
    this.confirmationService.open({
      text: QuestionsLabels.reallyDelete,
      isDanger: true,
      action: async () => {
        if (!this.questionId) {
          console.error('DeleteQuestion: id not defined');
          return;
        }

        await this.questionService.softDelete(this.questionId);
        await this.routingService.toQuestionOverview();
      },
    });
  }
}
