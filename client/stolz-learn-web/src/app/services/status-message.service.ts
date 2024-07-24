import { Injectable, signal } from '@angular/core';
import { StatusMessageModel } from '../models/status-message.model';

@Injectable({ providedIn: 'root' })
export class StatusMessageService {
  private _messages = signal<StatusMessageModel[]>([]);

  public messages = this._messages.asReadonly();
  public addMessage(message: StatusMessageModel) {
    this._messages.update((ms) => [...ms, message]);

    const to = setTimeout(
      () =>
        this._messages.update((ms) => {
          clearTimeout(to);

          return [...ms.slice(1, ms.length)];
        }),
      3000,
    );
  }
}
