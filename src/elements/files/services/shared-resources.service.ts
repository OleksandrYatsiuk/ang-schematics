import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable, EMPTY } from 'rxjs';
import { ModelResource, ResourcesService, EnumResourceType, EnumResStrategies, ResourcesStrategyFactory } from 'spm-core';
import { map, catchError } from 'rxjs/operators';
import { ISiteVariables } from '../../models/site-variables.model';

@Injectable({
  providedIn: 'root'
})
export class SharedResourcesService {
  private _resources$ = new ReplaySubject<ModelResource[]>(1);

  constructor(
    @Inject('APP_CONFIG') private _appConfig: ISiteVariables,
    private _resourcesServ: ResourcesService
  ) { }

  queryResources(lang = this._appConfig.defLang): Observable<ModelResource[]> {
    return this._resourcesServ.queryResources({
      siteId: this._appConfig.id,
      lang,
      sitePageGroupId: null,
      type: EnumResourceType.SHARED
    })
      .pipe(
        catchError(e => {
          console.error(e);
          return EMPTY;
        }),
        map((models: ModelResource[]) => {
          this._resources$.next(models);
          return models;
        })
      );
  }

  getRes(key: string, strategy = EnumResStrategies.AS_STRING): Observable<any> {
    return this._resources$
      .pipe(
        map((models: ReadonlyArray<ModelResource>) => {
          const res = models.map(m => new ModelResource(m));
          const particularStrategy = new ResourcesStrategyFactory(res)
            .buildStrategy(strategy);
          return particularStrategy.getResource(key);
        })
      );
  }

  get resources(): Observable<ModelResource[]> {
    return this._resources$.asObservable();
  }
}
