import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class LoadingService {

    constructor() {}

  start() {
    // NProgress.configure({ showSpinner: true, trickleSpeed: 100 });
    NProgress.start();
  }

  done() {
    NProgress.done();
  }

}
