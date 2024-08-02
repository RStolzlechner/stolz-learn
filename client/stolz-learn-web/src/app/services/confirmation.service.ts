import { Injectable, signal } from '@angular/core';
import { ConfirmationModel } from '../models/confirmation.model';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private _isOpened = signal<boolean>(false);
  public isOpened = this._isOpened.asReadonly();

  private _confirmationData = signal<ConfirmationModel>({
    text: '',
    isDanger: false,
    action: () => console.error('confirmationData not set'),
  });
  public confirmationData = this._confirmationData.asReadonly();

  public open(data: ConfirmationModel) {
    this._confirmationData.set(data);
    this._isOpened.set(true);
  }

  public close() {
    this._isOpened.set(false);
  }
}
