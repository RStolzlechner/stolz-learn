import { inject, Injectable, signal } from '@angular/core';
import { QuestionHttpService } from './http/question-http.service';
import { StatusMessageService } from './status-message.service';
import { QuestionQuery } from '../models/question-query.model';
import { GUID } from '../types/guid.type';
import { Question } from '../models/question.model';
import { firstValueFrom } from 'rxjs';
import { ErrorMessages } from '../translations/error-messages.translations';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private questionHttpService = inject(QuestionHttpService);
  private statusMessageService = inject(StatusMessageService);

  private _questionQuery = signal<QuestionQuery | null>(null);
  private _questionIds = signal<GUID[]>([]);
  private _questions = signal<Question[]>([]);
  public questions = this._questions.asReadonly();

  public async loadQuestions(query: QuestionQuery) {
    try {
      const ids = await firstValueFrom(
        this.questionHttpService.selectIdsByQuery(query),
      );

      let questions: Question[] = [];
      if (ids.length > 0) {
        questions = await firstValueFrom(
          this.questionHttpService.selectByIds(ids),
        );
      }

      this._questionQuery.set(query);
      this._questionIds.set(ids);
      this._questions.set(questions);
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.loadCourses,
        type: 'error',
      });

      this._questionQuery.set(null);
      this._questionIds.set([]);
      this._questions.set([]);
    }
  }

  public async createQuestion(question: Question) {
    try {
      const id = await firstValueFrom(
        this.questionHttpService.insert(question),
      );
      question.id = id;

      //don't call server; delete this when signal-r update is implemented
      this._questionIds.update((ids) => [...ids, id]);
      this._questions.update((qs) => [...qs, question]);
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.createQuestion,
        type: 'error',
      });
    }
  }

  public async updateQuestion(question: Question) {
    try {
      await firstValueFrom(this.questionHttpService.update(question));

      //don't call server; delete this when signal-r update is implemented
      this._questions.update((qs) => {
        const ix = qs.findIndex((q) => q.id === question.id);
        if (ix < 0) {
          return qs;
        }
        return [...qs.slice(0, ix), question, ...qs.slice(ix + 1)];
      });
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.updateQuestion,
        type: 'error',
      });
    }
  }

  public async softDelete(id: GUID) {
    try {
      await firstValueFrom(this.questionHttpService.softDelete(id));

      //don't call server; delete this when signal-r update is implemented
      this._questionIds.update((ids) => [...ids.filter((i) => i !== id)]);
      this._questions.update((cs) => [...cs.filter((c) => c.id !== id)]);
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.deleteQuestion,
        type: 'error',
      });
    }
  }
}
