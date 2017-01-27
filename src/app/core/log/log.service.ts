import { Injectable, ErrorHandler } from '@angular/core';

import { LoadingService } from '../loading/loading.service';
import { NotificationService } from '../notification/notification.service';
import  { environment } from '../../../environments/environment';

declare let Raven: any;

const logLevel = {
  error: 'error',
  warning: 'warning',
  info: 'info'
};

@Injectable()
export class LogService extends ErrorHandler {

  private defaultErrorMessage = 'An error has occured! An error report has been sent.';

  constructor(private loadingService: LoadingService, private notification: NotificationService) {
   // Rethrow exceptions that occur in bootstrap to angular
   super(true);
  }

/**
 * This method handles unhandeled exceptions caught by angular.
 * Exceptions thrown before angular loads should be caught by Raven.config().install() in index.html
 * For custom error handling use logError()
 */
  handleError(error: any): void {
    try {
      this.log(error, true, true, logLevel.error, this.defaultErrorMessage);
    } catch (err) {
      console.log(error);
      console.log(err);
    }
  }

/**
 * This method should be used to handle exceptions
 */
  logError(error: any, message = this.defaultErrorMessage): void {
    this.log(error, true, true, logLevel.error, message);
  }

/**
 * Log +/- notify warning
 */
  logWarning(message: string, notify = false): void {
    this.log(null, false, notify, logLevel.warning, message);
  }

/**
 * Log +/- notify message
 */
  logMessage(message: string, notify = false): void {
    this.log(null, false, notify, logLevel.info, message);
  }

/**
 * The actual implementation of logging,
 * in development environment, it logs to console
 * otherwise, it sends logs to server
 */
  private log(error: any, stopLoading = false, notify = false, notificationType = logLevel.info, message = ''): void {

    // stop progress loading
    if (stopLoading) {
      this.loadingService.done();
    }

    // show notification message
    if (notify && message) {
      switch (notificationType) {
        case logLevel.error:
          this.notification.error(message);
          break;
        case logLevel.warning:
          this.notification.warning(message);
          break;
        default:  // logLevel.info
          this.notification.info(message);
      }
    }

    // Raven additional data
    let options = {
      level: notificationType,
      tags: {
        client: environment.client
      },
      extra: {
        message: message
      }
    };


    // if not in development, send to Sentry.io
    if (environment.envName !== 'development') {
      if (error) {
        Raven.captureException(error.originalError, options);
      } else {
        Raven.captureMessage(message, options);
      }
    }

    if (error) {
      super.handleError(error);   // use angular error handler
    } else if (environment.envName === 'development') {
      console.log(message);       // if in development, log messages to console
    }

  }

}
