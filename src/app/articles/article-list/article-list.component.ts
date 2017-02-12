import { ArticleModule } from './../article.module';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { LogService } from './../../core/log/log.service';
import { LoadingService } from './../../core/loading/loading.service';
import { PaginationComponent } from './../../shared/pagination/pagination.component';
import { ArticleService } from './../article.service';
import { IArticle } from '../article.model';

@Component({
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, AfterViewInit {

  items: IArticle[];

  currentPage: number = 1;
  itemsPerPage: number;
  totalItems: number;

  @ViewChild('pagination') pagination: PaginationComponent;

  constructor(
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private logService: LogService
    ) { }


  ngOnInit(): void {
    this.itemsPerPage = this.articleService.getNumberOfArticlesPerPage();
  }

  ngAfterViewInit(): void {
    this.loadArticles(this.pagination.pageQuery);
  }

  loadArticles(page: number) {

    this.loadingService.start();

    this.articleService.getArticles(page).subscribe(
      articles => {
        this.items = articles;
        this.totalItems = this.articleService.getNumberOfTotalItems();

        this.currentPage = page;
        this.loadingService.done();

        this.pagination.pageQuery = page;
        window.scrollTo(0, 0);  // TODO smooth scroll
      },
      error => {
        this.logService.logError(error, 'Loading error! Network connection failed.');
      }
    );
  }

}
