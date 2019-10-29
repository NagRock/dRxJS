import {NgModule} from '@angular/core';
import {PropertyComponent, PropertyExpandableDirective} from './property.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [PropertyComponent, PropertyExpandableDirective],
  exports: [PropertyComponent, PropertyExpandableDirective],
  imports: [
    CommonModule
  ]
})
export class PropertyModule {

}
