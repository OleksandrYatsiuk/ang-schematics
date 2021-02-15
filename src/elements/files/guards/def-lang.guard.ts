import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LangService } from '../../services/lang/lang.service';
import { ISiteVariables } from '../../models/site-variables.model';

@Injectable({
  providedIn: 'root'
})
export class DefLangGuard implements CanActivate {
  constructor(
    @Inject('APP_CONFIG') private _conf: ISiteVariables,
    private _lang: LangService,
    private _router: Router
  ) { }

  allowedLang = ['ru', 'en', 'ua'];

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const lang = this._lang.getFromLocalStorage();
    const isAllowed = this._conf.allowedLang.find(l => lang === l);

    const tempLang = lang === 'uk' || !lang || !isAllowed ? 'ua' : lang;
    if (!isAllowed) {
      this._lang.setLang(tempLang === 'ua' ? 'uk' : tempLang);
    }
    this._router.navigate(['/' + tempLang]);
    return false;
  }
}
