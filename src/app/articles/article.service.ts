import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs';

import { IArticle } from './article.model';
import { environment, data } from '../../environments/environment';


@Injectable()
export class ArticleService {

    private articles: IArticle[];


    private url = environment.papersApiUrl + environment.apiArticles;

    private itemsPerPage = environment.itemsPerPage;

    private totalItems: number;

    private filters = 'filter[meta_key]=has_audio&filter[meta_value]=1';

    private fields = {
        'id': 'id',
        'title': 'title.rendered',
        'pmid': 'acf.pmid',
        'date': 'acf.publication_date',
        'year': 'acf.year',
        'month': 'acf.month',
        'authors': 'acf.authors',
        'abstract': 'acf.abstract',
        'journal': 'acf.journal',
        'journalIssn': 'acf.journal_issn',
        'publicationTypes': 'acf.publication_types',
        'audioDuration': 'acf.audio_duration'
    };

    // convert fields object to string and remove double quotes
    private formattedFields = '_query=[*].' + JSON.stringify(this.fields).replace(/"/g, '');

    private client = 'client=' + environment.client;

    private fullUrl = this.url + '?' + this.filters + '&' + this.formattedFields + '&' + this.client;

    private db: any;
    private dbCollectionName = 'articles';
    private dbCollection: any;

    constructor(private http: Http) {
        // load loki database
        this.db = new loki('app.json',
            {
                adapter: environment.dbAdapter,
                autosave: true,
                autosaveInterval: 10000  // 10 seconds
            });
        console.log('constructor()');

        this.loadData();
    }


    private loadData(): Observable<any> {
        return Observable.create(
            observer => {
                // convert loki loadDatabase with callback to observable
                let loadDb = Observable.bindCallback(this.db.loadDatabase);
                loadDb().subscribe(
                    x => {
                        // load or initialize collection
                        this.dbCollection = this.db.getCollection(this.dbCollectionName);
                        if (this.dbCollection === null) {
                            this.dbCollection = this.db.addCollection(this.dbCollectionName);
                        }
                        console.log('loadHandler()');
                        observer.next(this.dbCollection);
                        observer.complete();
                    },
                    error => this.handleError
                );
            }
        );
    }

    private requestArticles(url: string) {
        return this.http.get(url)
            .do((response: Response) => {
                this.totalItems = Number(response.headers.get('X-WP-Total'));
            })
            .map((response: Response) => <IArticle[]>response.json())
            .do(data => this.articles = data)
            .catch(this.handleError);
    }

    getArticles(page?: number, filters?: {}): Observable<IArticle[]> {
        let pageQuery = '&per_page=' + this.itemsPerPage;
        if (page) {
            pageQuery += '&page=' + String(page);
        }
        console.log('getArticles()');

        // this.formatFilters(filters);

        return this.loadData().map(
            data => {
                if (this.dbCollection.data.length = 0) {
                    return this.requestArticles(this.fullUrl + pageQuery)
                        .do(
                        response => {
                            this.dbCollection.insert(response);
                            console.log('requesting articles');
                        }
                        )
                        .map(a => this.dbCollection.data);

                } else {

                    console.log('articles from cache');
                    return this.dbCollection.data;
                }

            },
            error => this.handleError
        );

    }

    getArticlesInJournal(journalIssn: string): Observable<IArticle[]> {
        if (journalIssn) {
            let journalFilter: string = 'filter[meta_key]=journal_issn&filter[meta_value]=' + journalIssn;
            return this.requestArticles(this.fullUrl + '&' + journalFilter);
        } else {
            this.getArticles();
        }
    }

    getArticle(id: number) {
        // return this.getArticles()
        //   .map((articles: IArticle[]) => articles.find(article => article.id === id));
    }

    getNumberOfArticlesPerPage(): number {
        return this.itemsPerPage;
    }

    getNumberOfTotalItems(): number {
        return this.totalItems;
    }

    // TODO implement (convert filter object to querystring)
    /*
    private formatFilters(filters: {}): string {
      return '';
    }
    */

    // TODO log errors
    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().error || 'server error');
    }


}
