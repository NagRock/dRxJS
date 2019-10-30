import {NgModule} from '@angular/core';
import {PropertyNodeComponent} from './property-node.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [PropertyNodeComponent],
  exports: [PropertyNodeComponent],
  imports: [
    CommonModule
  ]
})
export class PropertyNodeModule {

}
