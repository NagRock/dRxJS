import {NgModule} from '@angular/core';
import {RefExplorerComponent} from './ref-explorer.component';
import {CommonModule} from '@angular/common';
import {ValueRefExplorerComponent} from './value/value-ref-explorer.component';
import {ObjectRefExplorerComponent} from './object/object-ref-explorer.component';

@NgModule({
  declarations: [
    RefExplorerComponent,
    ValueRefExplorerComponent,
    ObjectRefExplorerComponent,
  ],
  exports: [RefExplorerComponent],
  imports: [
    CommonModule
  ]
})
export class RefExplorerModule {

}
