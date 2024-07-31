import { computed, inject, Injectable, signal } from '@angular/core';
import { StatusMessageService } from './status-message.service';
import { QuestionnaireHttpService } from './http/questionnaire-http.service';
import { Questionnaire } from '../models/questionnaire.model';
import { firstValueFrom } from 'rxjs';
import { ErrorMessages } from '../translations/error-messages.translations';
import { QuestionService } from './question.service';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { GUID } from '../types/guid.type';
import { DateTime } from '../types/date-time.type';
import { RoutingService } from './routing.service';
import { QuestionnaireStatistic } from '../models/questionnaire-statistic.model';

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  private questionnaireHttpService = inject(QuestionnaireHttpService);
  private statusMessageService = inject(StatusMessageService);
  private questionService = inject(QuestionService);
  private routingService = inject(RoutingService);

  private _allSteps = signal(-1);
  private _step = signal(-1);
  private _questions = signal<Question[]>([]);
  private _answers = signal<Answer[]>([]);
  private _statistics = signal<QuestionnaireStatistic | undefined>(undefined);

  allSteps = this._allSteps.asReadonly();
  step = this._allSteps.asReadonly();
  hasNext = computed(() => this.step() < this.allSteps() - 1);
  question = computed(() => this._questions()[this.step()]);
  statistics = this._statistics.asReadonly();

  public start(steps = 10) {
    const questions = this.questionService.questions();
    if (questions.length == 0) return false;

    const allSteps = questions.length >= steps ? steps : questions.length;
    this._allSteps.set(allSteps);
    this._step.set(0);

    const randomQuestions: Question[] = [];
    const answers: Answer[] = [];
    while (randomQuestions.length < allSteps) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      if (!randomQuestions.includes(questions[randomIndex])) {
        randomQuestions.push(questions[randomIndex]);
        answers.push({
          id: GUID.empty,
          questionId: questions[randomIndex].id,
          questionnaireId: GUID.empty,
          givenAnswer: '',
          isCorrect: false,
          dateCreate: DateTime.now(),
        });
      }
    }
    this._questions.set(randomQuestions);
    this._answers.set(answers);

    return true;
  }

  public giveAnswer(answer: string) {
    this._answers.update((answers) => {
      const updated = [...answers];
      updated[this.step()].givenAnswer = answer;
      return updated;
    });
  }

  public evaluateAnswer(isCorrect: boolean) {
    this._answers.update((answers) => {
      const updated = [...answers];
      updated[this.step()].isCorrect = isCorrect;
      return updated;
    });

    this._step.update((step) => step + 1);
  }

  public async end() {
    const courseId = this.routingService.courseId();
    if (!courseId) {
      console.error('QuestionnaireService::end courseId not loaded');
      return;
    }

    const questionnaire: Questionnaire = {
      id: GUID.empty,
      courseId,
      dateCreate: DateTime.now(),
      answers: this._answers(),
    };

    try {
      const statistics = await firstValueFrom(
        this.questionnaireHttpService.addQuestionnaire(questionnaire),
      );
      this._statistics.set(statistics);

      return true;
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.createCourse,
        type: 'error',
      });
      return false;
    }
  }
}
