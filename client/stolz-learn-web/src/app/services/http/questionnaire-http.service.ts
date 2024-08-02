import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpUrl } from '../../constants/http-url.const';
import { Questionnaire } from '../../models/questionnaire.model';
import { QuestionnaireStatistic } from '../../models/questionnaire-statistic.model';

@Injectable({ providedIn: 'root' })
export class QuestionnaireHttpService {
  private httpClient = inject(HttpClient);

  public addQuestionnaire(questionnaire: Questionnaire) {
    const url = `${httpUrl}questionnaire`;
    return this.httpClient.post<QuestionnaireStatistic>(url, questionnaire);
  }
}
