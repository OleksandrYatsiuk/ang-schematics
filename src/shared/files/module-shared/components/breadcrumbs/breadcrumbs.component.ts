import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { IBreadcrumb } from '@models/breadcrumbs';
import { SharedResourcesService } from '@services/sharedRes/shared-resources.service.ts.service';
import { EnumResStrategies, ModelResource, unwrapRes } from 'spm-core';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent implements OnInit {
    @Input() current: string;
    @Input() parents: IBreadcrumb[];
    @Input() invert = false;
    allSharedRes: ModelResource[] = [];
    constructor(
        private _cd: ChangeDetectorRef,
        private _sh: SharedResourcesService,
    ) { }

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

    trackItem(index: number, item: IBreadcrumb): number {
        return index;
    }

}
