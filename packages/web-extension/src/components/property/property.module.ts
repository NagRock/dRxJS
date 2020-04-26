import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PropertyComponent, PropertyExpandDirective} from './property.component';
import { PropertyOutletComponent } from './property-outlet.component';

@NgModule({
  declarations: [PropertyComponent, PropertyExpandDirective, PropertyOutletComponent],
  exports: [
    PropertyComponent,
    PropertyExpandDirective,
    PropertyOutletComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class PropertyModule {
}
