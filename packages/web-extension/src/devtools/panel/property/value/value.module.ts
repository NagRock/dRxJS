import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValueComponent} from './value.component';

@NgModule({
  declarations: [ValueComponent],
  exports: [
    ValueComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class ValueModule {
}
