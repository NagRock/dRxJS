import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeclarationListComponent} from './declaration-list.component';
import {PropertyModule, ValueModule} from '../../../../components/property';

@NgModule({
  declarations: [DeclarationListComponent],
  exports: [
    DeclarationListComponent
  ],
  imports: [
    CommonModule,
    PropertyModule,
    ValueModule,
  ]
})
export class DefinitionListModule { }
