import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBreadcrumb } from '@models/breadcrumb/breadcrumb';
import { IQueryNewsListParams } from '@models/news/news-params';
import { ISiteVariables } from '@models/site-variables/site-variables';
import { LangService } from '@services/lang/lang.service';
import { SharedResourcesService } from '@services/shared-resources/shared-resources.service';
import { GroupService } from '@services/sitegroup/sitegroup.service';
import { Observable, EMPTY, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, pluck } from 'rxjs/operators';
import {
  EnumResStrategies, ModelResource, ModelNewsListItem, ModelSiteGroup,
  MetaDataService, NewsService, EnumEventsRoutes, EnumLanguages, getAdvancedRes, TNewsPagination, unwrapRes, ModelNews
} from 'spm-core';

@Component({
  selector: 'app-events-item',
  templateUrl: './events-item.component.html',
  styleUrls: ['./events-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsItemComponent implements OnInit {
  eventRoutes = EnumEventsRoutes;
  parent: IBreadcrumb;
  private _path: string;

  get route(): string {
    return this._path;
  }
  set route(url: string) {
    this._path = `${this.eventRoutes.ALL_ARTICLES}/${url}`;
  }
  strategy = EnumResStrategies;
  newsList: ModelNewsListItem[];
  allSharedRes: ModelResource[] = [];
  allRes = new ModelSiteGroup();
  item: ModelNews;
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
          return this._queryNewsItem(lang, `${this.route}/${params.ceoUrl}`);
        }),
        mergeMap((item) => {
          this.item = item;
          return forkJoin([
            this._siteGroup.querySiteGroupV1(this.route, this._langServ.getLang()),
            this._queryNewsList(this._langServ.getLang(), { route: this.route, excludeId: item.id })
          ]);
        }),
        catchError(e => {
          console.error(e);
          return EMPTY;
        })
      )
      .subscribe(([res, list]: [ModelSiteGroup, ModelNewsListItem[]]) => {
        this.allRes = res;
        this.newsList = list;
        this.parent = {
          url: `/${this.route}`,
          title: this.getSiteGroup('pageTitle')
        };
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

  private _queryNewsList(lang: EnumLanguages, params?: Partial<IQueryNewsListParams>): Observable<ModelNewsListItem[]> {
    return this._ns.queryNewsList({
      currentPage: 1,
      rowsPerPage: 10,
      lang,
      route: EnumEventsRoutes.ALL_ARTICLES,
      siteId: this._conf.id,
      sortField: 'publishDate desc',
      ...params
    }).pipe(
      pluck('result'),
      catchError(e => {
        console.log(e);
        return EMPTY;
      })
    );
  }

  private _queryNewsItem(lang: EnumLanguages, link: string): Observable<ModelNews> {
    return this._ns.queryNews(lang, link, this._conf.id).pipe(
      catchError(e => {
        console.log(e);
        return EMPTY;
      })
    );
  }

}
