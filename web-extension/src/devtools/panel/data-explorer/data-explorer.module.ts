import {NgModule} from '@angular/core';
import {DataExplorerComponent} from './data-explorer.component';
import {CommonModule} from '@angular/common';
import {ValueExplorerComponent} from './value/value-explorer.component';

@NgModule({
  declarations: [
    DataExplorerComponent,
    ValueExplorerComponent,
  ],
  exports: [DataExplorerComponent],
  imports: [
    CommonModule
  ]
})
export class DataExplorerModule {

}
