import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeclarationListComponent } from './declaration-list.component';
import {PropertyModule, ValueModule} from '../../../../components/property';
import {ReferencePropertyModule} from '../../../../components/reference-property';

@NgModule({
  declarations: [DeclarationListComponent],
  exports: [
    DeclarationListComponent
  ],
  imports: [
    CommonModule,
    PropertyModule,
    ValueModule,
    ReferencePropertyModule
  ]
})
export class DefinitionListModule { }
