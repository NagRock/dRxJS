import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArrayComponent} from './array.component';

@NgModule({
  declarations: [ArrayComponent],
  exports: [
    ArrayComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class ArrayModule {
}
