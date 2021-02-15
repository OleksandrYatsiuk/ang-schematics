import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './components/news/news.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@module-shared/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';

const routes: Routes = [
  { path: '', component: NewsComponent },
  { path: ':event', component: NewsComponent },
];

@NgModule({
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginatorModule,
    SelectButtonModule,
    SharedModule
  ],
  exports: []
})
export class ModuleNews { }
