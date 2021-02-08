import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQueryNewsListParams } from '@models/news/news-params';
import { IPaginationChange } from '@models/paginator/paginator';
import { ISiteVariables } from '@models/site-variables/site-variables';
import { LangService } from '@services/lang/lang.service';
import { SharedResourcesService } from '@services/shared-resources/shared-resources.service';
import { GroupService } from '@services/sitegroup/sitegroup.service';
import { SelectItem } from 'primeng/api';
import { forkJoin, EMPTY, Observable } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import {
  EnumResStrategies, ModelResource, ModelSiteGroup, MetaDataService,
  unwrapRes, getAdvancedRes, ModelNewsListItem, NewsService, EnumLanguages, EnumEventsRoutes, TNewsPagination
} from 'spm-core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent implements OnInit {

  eventRoutes = EnumEventsRoutes;
  fillerOptions: SelectItem[] = [];
  private _path: string;
  get route(): string {
    return this._path;
  }
  set route(url: string) {
    url ? this._path = `${this.eventRoutes.ALL_ARTICLES}/${url}` : this._path = this.eventRoutes.ALL_ARTICLES;
  }
  rows = 12;
  totalRecords: number;
  totalPages: number;

  complexesList: SelectItem[] = [];
  strategy = EnumResStrategies;
  allSharedRes: ModelResource[] = [];
  newsList: ModelNewsListItem[];
  allRes = new ModelSiteGroup();
  isBrowser: boolean;
  constructor(
    @Inject('APP_CONFIG') private _conf: ISiteVariables,
    @Inject(PLATFORM_ID) private _pid: any,
    private _sh: SharedResourcesService,
    private _siteGroup: GroupService,
    private _langServ: LangService,
    private _cd: ChangeDetectorRef,
    private _md: MetaDataService,
    private _route: ActivatedRoute,
    private _ns: NewsService
  ) {
    this.isBrowser = isPlatformBrowser(this._pid);
  }

  ngOnInit(): void {
    /**
     * Group resources
     */
    this._langServ
      .onChange()
      .pipe(
        mergeMap(lang => {
          return this._route.params
            .pipe(
              map(params => ({ lang, params }))
            );
        }),
        mergeMap(({ lang, params }) => {
          this.route = params.event;
          return forkJoin([
            this._siteGroup.querySiteGroupV1(this.route, lang),
            this._queryNewsList(lang, { route: this.route })
          ]);
        }),
        catchError(e => {
          console.error(e);
          return EMPTY;
        })
      )
      .subscribe(([res, news]: [ModelSiteGroup, TNewsPagination]) => {
        this.allRes = res;
        this.totalRecords = news.rowCount;
        this.totalPages = news.pageCount;
        this.newsList = news.result;
        this._md.updateMeta({
          title: res.seoTitle,
          description: res.seoDescription
        });
        this._cd.detectChanges();
      });
    /**
     * Shared res
     */
    this._sh.resources
      .subscribe(allRes => {
        this.allSharedRes = allRes.map(r => r.clone());
        this._cd.detectChanges();
      });
  }

  onPageChange({ page }: IPaginationChange): void {
    this.scrollToTop();
    this._queryNewsList(this._langServ.getLang(), { currentPage: page })
      .subscribe(news => {
        this.newsList = news.result;
        this.totalRecords = news.rowCount;
        this._cd.detectChanges();
      });
  }

  private scrollToTop(): void {
    if (this.isBrowser) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  getRes(key: string, strategy = EnumResStrategies.AS_STRING): any {
    return unwrapRes(this.allSharedRes, key, strategy);
  }

  getSiteGroup(key: string, strategy = EnumResStrategies.AS_STRING): any {
    return unwrapRes(this.allRes.resources, key, strategy);
  }

  getAdv(item: ModelResource[], key: string, nestedKey = 'content'): string {
    return getAdvancedRes(item, key, nestedKey);
  }

  trackItem(index: number, item: any): number {
    return index;
  }

  private _queryNewsList(lang: EnumLanguages, params?: Partial<IQueryNewsListParams>): Observable<TNewsPagination> {
    return this._ns.queryNewsList({
      currentPage: 1,
      rowsPerPage: this.rows,
      lang,
      route: this.route,
      siteId: this._conf.id,
      sortField: 'publishDate desc',
      ...params
    }).pipe(
      catchError(e => {
        console.log(e);
        return EMPTY;
      })
    );
  }


}
