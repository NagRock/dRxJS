import {NgModule} from '@angular/core';
import {PropertiesTreeComponent} from './properties-tree.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [PropertiesTreeComponent],
  exports: [PropertiesTreeComponent],
  imports: [
    CommonModule
  ]
})
export class PropertiesTreeModule {

}
