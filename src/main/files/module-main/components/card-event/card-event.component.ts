import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { EnumEventsRoutes, EnumResStrategies, ModelNewsListItem, unwrapRes } from 'spm-core';
import { SharedResourcesService } from '@services/shared-resources/shared-resources.service';


@Component({
  selector: 'app-card-event',
  templateUrl: './card-event.component.html',
  styleUrls: ['./card-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardEventComponent implements OnInit {
  @Input() card: ModelNewsListItem;

  allSharedRes = [];
  strategy = EnumResStrategies;
  eventTypesEnum = EnumEventsRoutes;
  constructor(
    private _sh: SharedResourcesService,
    private _cd: ChangeDetectorRef,
  ) {
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
