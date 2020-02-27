import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpecialComponent} from './special.component';

@NgModule({
  declarations: [SpecialComponent],
  exports: [
    SpecialComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class SpecialModule {
}
