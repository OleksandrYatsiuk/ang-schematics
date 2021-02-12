import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { SharedResourcesService } from '@services/shared-resources/shared-resources.service';
import { EnumResStrategies, EnumUnityTypes, ModelComplexDim, ModelResource, unwrapRes } from 'spm-core';

@Component({
  selector: 'app-card-complex',
  templateUrl: './card-complex.component.html',
  styleUrls: ['./card-complex.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComplexComponent implements OnInit {
  @Input() card: ModelComplexDim;
  strategy = EnumResStrategies;
  unitTypes = EnumUnityTypes;
  allSharedRes: ModelResource[] = [];
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private _pid,
    private _sh: SharedResourcesService,
    private _cd: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this._pid);
  }

  ngOnInit(): void {
    this._sh.resources
      .subscribe(allRes => {
        this.allSharedRes = allRes.map(r => r.clone());
        this._cd.detectChanges();
      });
  }

  getRes(key: string, strategy = EnumResStrategies.AS_STRING): any {
    return unwrapRes(this.allSharedRes, key, strategy);
  }

}
