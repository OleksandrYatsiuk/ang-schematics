import { Inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ISiteVariables } from '@models/site-variables.model';
import { LangService } from '@services/lang/lang.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangGuard implements CanActivate {
  constructor(
    @Inject('APP_CONFIG') private _appConfig: ISiteVariables,
    private _lang: LangService,
    private _router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const langFromRouter = next.params.lang;
    const islangValid = this._appConfig.allowedLang.find(l => l === langFromRouter);
    if (!islangValid) {
      this._router.navigate(['unknownLang/404']);
      return false;
    } else {
      const langFromLocalStorage = this._lang.getFromLocalStorage();
      const tempCompareFromLocalStorage = langFromLocalStorage === 'uk' ? 'ua' : langFromLocalStorage;
      const langForWrite = langFromRouter === 'ua' ? 'uk' : langFromRouter;
      if (langFromRouter !== tempCompareFromLocalStorage) {
        this._lang.setLang(langForWrite);
      }
      return true;
    }
  }
}

