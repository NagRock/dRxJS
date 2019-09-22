import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSelectorComponent } from './instance-selector.component';

@NgModule({
  declarations: [InstanceSelectorComponent],
  exports: [
    InstanceSelectorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class InstanceSelectorModule { }
