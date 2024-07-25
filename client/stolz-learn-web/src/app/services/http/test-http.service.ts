import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpUrl } from '../../constants/http-url.const';

@Injectable({ providedIn: 'root' })
export class TestHttpService {
  private httpClient = inject(HttpClient);

  public test() {
    const url = `${httpUrl}test/ping`;
    return this.httpClient.get<string>(url);
  }
}
