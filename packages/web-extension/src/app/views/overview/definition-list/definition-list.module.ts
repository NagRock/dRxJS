import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefinitionListComponent } from './definition-list.component';
import {PropertyModule, ValueModule} from '../../../../components/property';
import {ReferencePropertyModule} from '../../../../components/reference-property';

@NgModule({
  declarations: [DefinitionListComponent],
  exports: [
    DefinitionListComponent
  ],
  imports: [
    CommonModule,
    PropertyModule,
    ValueModule,
    ReferencePropertyModule
  ]
})
export class DefinitionListModule { }
