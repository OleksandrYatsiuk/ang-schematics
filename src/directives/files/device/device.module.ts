import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceDirective } from './device.directive';

@NgModule({
  declarations: [DeviceDirective],
  imports: [
    CommonModule
  ],
  exports: [DeviceDirective]
})
export class DeviceModule { }
