import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeclarationPropertyComponent } from './declaration-property.component';
import {ReferencePropertyModule} from '../reference-property.module';
import {ArrayModule, PropertyModule, ValueModule} from '../../property';
import {SpecialModule} from '../../property/special';

@NgModule({
  declarations: [DeclarationPropertyComponent],
  imports: [
    CommonModule,
    ReferencePropertyModule,
    PropertyModule,
    ValueModule,
    SpecialModule,
    ArrayModule
  ]
})
export class DeclarationPropertyModule { }
