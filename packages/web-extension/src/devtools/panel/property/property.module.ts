import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PropertyComponent, PropertyExpandDirective} from './property.component';

@NgModule({
  declarations: [PropertyComponent, PropertyExpandDirective],
  exports: [
    PropertyComponent,
    PropertyExpandDirective,
  ],
  imports: [
    CommonModule,
  ]
})
export class PropertyModule {
}
