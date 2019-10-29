import {NgModule} from '@angular/core';
import {PropertyExplorerComponent} from './property-explorer.component';
import {CommonModule} from '@angular/common';
import {PropertyExplorerValueComponent} from './value/property-explorer-value.component';
import {PropertyExplorerObjectComponent} from './object/property-explorer-object.component';
import {PropertyExplorerLazyComponent} from './lazy/property-explorer-lazy.component';
import {PropertyModule} from '../property/property.module';

@NgModule({
  declarations: [
    PropertyExplorerComponent,
    PropertyExplorerValueComponent,
    PropertyExplorerObjectComponent,
    PropertyExplorerLazyComponent,
  ],
  exports: [PropertyExplorerComponent],
  imports: [
    CommonModule,
    PropertyModule
  ]
})
export class PropertyExplorerModule {
}
