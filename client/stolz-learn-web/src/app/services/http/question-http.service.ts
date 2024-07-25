import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpUrl } from '../../constants/http-url.const';
import { QuestionQuery } from '../../models/question-query.model';
import { GUID } from '../../types/guid.type';
import { Question } from '../../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionHttpService {
  private httpClient = inject(HttpClient);

  public selectIdsByQuery(query: QuestionQuery) {
    const url = `${httpUrl}question/ids`;
    return this.httpClient.post<GUID[]>(url, query);
  }

  public selectByIds(ids: GUID[]) {
    const url = `${httpUrl}question/get-by-ids`;
    return this.httpClient.post<GUID[]>(url, ids);
  }

  public insert(question: Question) {
    const url = `${httpUrl}question`;
    return this.httpClient.post<GUID>(url, question);
  }

  public update(question: Question) {
    const url = `${httpUrl}question`;
    return this.httpClient.put<GUID>(url, question);
  }

  public softDelete(id: GUID) {
    const url = `${httpUrl}question/soft-delete`;
    return this.httpClient.put<GUID>(url, id);
  }
}
