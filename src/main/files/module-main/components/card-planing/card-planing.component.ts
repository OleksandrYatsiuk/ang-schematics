import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { SharedResourcesService } from '@services/shared-resources/shared-resources.service';
import { EnumResStrategies, EnumUnityTypes,  ModelFlatTypeSearchItem, ModelResource, ModelUnit, unwrapRes } from 'spm-core';

@Component({
  selector: 'app-card-planing',
  templateUrl: './card-planing.component.html',
  styleUrls: ['./card-planing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardPlaningComponent implements OnInit {
  @Input() flatType: ModelFlatTypeSearchItem;
  @Input() unit: ModelUnit;
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
