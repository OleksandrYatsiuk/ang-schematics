import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventsItemComponent } from './components/events-item/events-item.component';
import { SharedModule } from '@module-shared/shared.module';

const routes: Routes = [
  { path: ':ceoUrl', component: EventsItemComponent }
];

@NgModule({
  declarations: [EventsItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EventItemModule { }
