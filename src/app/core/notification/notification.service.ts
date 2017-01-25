import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  private duration = 4000;

  constructor() { }

  message(message: string) {
    Materialize.toast(message, this.duration);
  }

  success(message: string) {
    Materialize.toast(message, this.duration, 'success');
  }

  info(message: string) {
    Materialize.toast(message, this.duration, 'info');
  }

  warning(message: string) {
    Materialize.toast(message, this.duration, 'warning');
  }

  error(message: string) {
    Materialize.toast(message, this.duration, 'error');
  }

}
