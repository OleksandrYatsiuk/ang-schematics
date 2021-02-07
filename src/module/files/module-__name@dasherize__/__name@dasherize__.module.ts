import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { <%= classify(name)%>Component } from './components/<%=dasherize(name)%>/<%=dasherize(name)%>.component';

const routes: Routes = [
  { path: '', component: <%= classify(name)%>Component }
];

@NgModule({
  declarations: [<%= classify(name)%>Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: []
})
export class <%= classify(name)%>Module { }
