import { ChangeDetectorRef, Directive, Inject, Input, PLATFORM_ID, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type TDevice = 'mob' | 'mob-up' | 'tab' | 'tab-up'| 'lapt' | 'desk' | 'nomob' | 'nolapt';

@Directive({
  selector: '[appDevice]',
})
export class DeviceDirective {
  isBrowser: boolean;
  inserted: boolean;

  constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      @Inject(PLATFORM_ID) private _pid: any,
      private renderer: Renderer2,
      private _cd: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this._pid);
  }

  @Input() set appDevice(device) {
    this.controlTemplate(device);
    this.renderer.listen('window', 'resize', () => this.controlTemplate(device));
  }

  get width(): number {
    return this.isBrowser ? window.innerWidth : null;
  }

  controlTemplate(device: TDevice): void {
    const condition = this.checkDevice(device);
    if (condition) {
      if (!this.inserted) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.inserted = true;
      }
    } else {
      this.viewContainer.clear();
      this.inserted = false;
    }
    this._cd.detectChanges();
  }

  checkDevice(device: TDevice): boolean {
    if (device === 'mob' && this.width < 768) {
      return true;
    } else if (device === 'mob-up' && this.width <= 1440) {
      return true;
    } else if (device === 'tab' && this.width >= 768 && this.width <= 1279) {
      return true;
    }  else if (device === 'tab-up' && this.width >= 768 && this.width < 1440) {
      return true;
    } else if (device === 'lapt' && this.width >= 1280) {
      return true;
    } else if (device === 'desk' && this.width >= 1440) {
      return true;
    } else if (device === 'nomob' && this.width >= 768) {
      return true;
    } else if (device === 'nolapt' && this.width < 1280) {
      return true;
    } else {
      return false;
    }
  }
}
