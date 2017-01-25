import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core Components
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Core Services
import { LoadingService } from './loading/loading.service';
import { NotificationService } from './notification/notification.service';
import { LogService } from './log/log.service';

// Module-related Services
import { LectureService } from '../lectures/lecture.service';
import { ArticleService } from '../articles/article.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HomeComponent,
    PageNotFoundComponent
  ],
    providers: [
    LectureService,
    ArticleService,
    LoadingService,
    NotificationService,
    LogService,
    { provide: ErrorHandler, useExisting: LogService }
  ],

})
export class CoreModule { }
