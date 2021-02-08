import { Injectable, Inject } from '@angular/core';
import { ISiteVariables } from '@owntypes/site-variables/site.variables';
import {
  ResourcesService,
  ModelResource,
  EnumResourceType,
  EnumResStrategies,
  ResourcesStrategyFactory } from 'spm-core';
import { Observable, ReplaySubject, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResDataService {

  private _resources$ = new ReplaySubject<ReadonlyArray<ModelResource>>(1);
  constructor(
    @Inject('APP_CONFIG') private _appConfig: ISiteVariables,
    private _resources: ResourcesService
  ) { }

  queryResources(lang = this._appConfig.defLang): Observable<ReadonlyArray<ModelResource>> {

    return forkJoin([
      this._resources.queryResources({
        siteId: this._appConfig.id,
        lang,
        sitePageGroupId: null,
        type: EnumResourceType.SHARED
      }),
      this._resources.queryResources({
        siteId: this._appConfig.id,
        lang,
        sitePageGroupId: null,
        type: EnumResourceType.SITE
      })
    ])
    .pipe(
      map(([resShared, resSite]) => {
        const arr = [...resShared, ...resSite];
        this._resources$.next(arr);
        return arr;
      })
      // map((models: ReadonlyArray<ModelResource>) => {
      //   this._resources$.next(models);
      //   return models;
      // })
    );

    // return this._resources.queryResources({
    //   siteId: this._appConfig.id,
    //   lang,
    //   sitePageGroupId: null,
    //   type: EnumResourceType.SHARED
    // })
    //   .pipe(
    //     map((models: ReadonlyArray<ModelResource>) => {
    //       this._resources$.next(models);
    //       return models;
    //     })
    //   );
  }
  getRes(key: string, strategy = EnumResStrategies.AS_STRING): Observable<any> {
    return this._resources$
      .pipe(
        map((models: ReadonlyArray<ModelResource>) => {
          const res = models.map(m =>  new ModelResource(m));
          const particularStrategy = new ResourcesStrategyFactory(res)
                                      .buildStrategy(strategy);
          return particularStrategy.getResource(key);
        })
      );
  }
  get resources(): Observable<any> {
    return this._resources$.asObservable();
  }
}
