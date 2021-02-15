import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnumLanguages } from 'spm-core';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private _currentLang$ = new BehaviorSubject<EnumLanguages>(null);
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
  ) {
    this.isBrowser = isPlatformBrowser(_platformId);
  }

  getFromLocalStorage(): any | undefined {
    if (this.isBrowser) {
      return localStorage.getItem('lang');
    }
  }

  setLang(lang: EnumLanguages): void {
    this._setToLocalStorage(lang);
    this._currentLang$.next(lang);
  }

  writeLang(lang: EnumLanguages): void {
    this._setToLocalStorage(lang);
  }

  onChange(): Observable<EnumLanguages> {
    return this._currentLang$
      .pipe(
        filter(l => !!l)
      );
  }

  getLang(): EnumLanguages {
    return this._currentLang$.getValue();
  }

  private _setToLocalStorage(lang) {
    if (this.isBrowser) {
      localStorage.setItem('lang', lang);
    }
  }
}
