import { inject, Injectable } from '@angular/core';
import { StatusMessageService } from './status-message.service';
import { QuestionnaireHttpService } from './http/questionnaire-http.service';
import { Questionnaire } from '../models/questionnaire.model';
import { firstValueFrom } from 'rxjs';
import { ErrorMessages } from '../translations/error-messages.translations';

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  private questionnaireHttpService = inject(QuestionnaireHttpService);
  private statusMessageService = inject(StatusMessageService);

  public async addQuestionnaire(questionnaire: Questionnaire) {
    try {
      return await firstValueFrom(
        this.questionnaireHttpService.addQuestionnaire(questionnaire),
      );
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.createCourse,
        type: 'error',
      });
      return null;
    }
  }
}
