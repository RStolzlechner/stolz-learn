import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { QuestionService } from '../../services/question.service';
import { ButtonLabels } from '../../translations/button.translations';
import { QuestionsLabels } from '../../translations/questions.translations';
import { GUID } from '../../types/guid.type';

@Component({
  selector: 'app-question-overview',
  template: `@if (anyQuestions()) {
      <div class="max-h-80vh overflow-scroll">
        <table>
          @for (question of questions(); track question.id) {
            <tr>
              <td>{{ question.number }}</td>
              <td>{{ question.questionText }}</td>
              <td class="w-5">
                <button class="button-secondary" (click)="onEdit(question.id)">
                  <i class="icon icon-pencil"></i>
                </button>
              </td>
            </tr>
          }
        </table>
      </div>
    } @else {
      <div>{{ QuestionsLabels.noQuestionsFound }}</div>
    }
    <div class="mt-4">
      <button class="button-primary" (click)="onNewQuestion()">
        <i class="icon icon-plus"></i>
        <span class="ml-3">{{ ButtonLabels.newQuestion }}</span>
      </button>
      <button class="button-secondary ml-4" (click)="onBack()">
        <i class="icon icon-back"></i>
        <span class="ml-3">{{ ButtonLabels.back }}</span>
      </button>
    </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionOverviewComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly questionService = inject(QuestionService);

  protected questions = this.questionService.questions;
  protected anyQuestions = computed(() => {
    const questions = this.questions();
    return questions.length > 0;
  });

  ngOnInit() {
    this.routingService.setBreadCrumb(3, BreadcrumbLabels.overview);
  }

  protected readonly ButtonLabels = ButtonLabels;
  protected readonly QuestionsLabels = QuestionsLabels;

  async onNewQuestion() {
    await this.routingService.toQuestionNew();
  }

  async onEdit(id: GUID) {
    await this.routingService.toQuestionEdit(id);
  }

  async onBack() {
    await this.routingService.toCourse();
  }
}
