import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SharedResourcesService } from '@services/shared-resources/shared-resources.service';
import { EnumResStrategies, EnumUnityTypes, ModelResource, unwrapRes } from 'spm-core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

  unitType = EnumUnityTypes;
  allSharedRes: ModelResource[] = [];
  constructor(
    private _sh: SharedResourcesService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this._sh.resources
      .subscribe(allRes => {
        this.allSharedRes = allRes.map(r => r.clone());
        this._cd.detectChanges();
      });
  }

  getRes(key: string, strategy = EnumResStrategies.AS_STRING): string {
    return unwrapRes(this.allSharedRes, key, strategy);
  }


}
