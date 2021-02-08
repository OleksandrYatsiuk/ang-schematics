import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { IPaginationChange } from '@models/paginator/paginator';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit {

  @Input() rows = 10;
  @Input() totalRecords = 0;
  @Input() totalPages = 0;
  @Input() pageLinkSize = 3;
  @Input() styleClass: string;
  @Output() pageChange = new EventEmitter<IPaginationChange>();

  @ViewChild('paginator', { static: true }) paginator: Paginator;

  private _page = 1;

  get page(): number {
    if (this.totalPages > 1) {
      this._page = this.paginator.getPage() + 1;
    }
    return this._page;
  }
  set page(page: number) {
    this.paginator.changePage(page - 1);
    this._page = page;
  }

  constructor() { }

  ngOnInit(): void { }

  onSelectPage(page: number): void {
    this.page = page;
    this.pageChange.emit(this._pageChange(this.page));
  }

  onPageChange(event: IPaginationChange): void {
    ++event.page;
    this.pageChange.emit(event);
  }

  onSelectPointsLeft(n: number): void {
    this.page = n - Math.ceil(this.pageLinkSize / 2);
    this.pageChange.emit(this._pageChange(this.page));

  }
  onSelectPointsRight(n: number): void {
    this.page = n + Math.ceil(this.pageLinkSize / 2);
    this.pageChange.emit(this._pageChange(this.page));
  }

  private _pageChange(page: number): IPaginationChange {
    return {
      first: this.paginator.first,
      rows: this.rows,
      pageCount: this.totalPages,
      page
    };
  }

}
