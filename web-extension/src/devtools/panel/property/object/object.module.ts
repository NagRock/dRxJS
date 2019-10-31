import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjectComponent} from './object.component';

@NgModule({
  declarations: [ObjectComponent],
  exports: [
    ObjectComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class ObjectModule {
}
