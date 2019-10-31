import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReferencePropertyComponent} from './reference-property.component';
import {ValueReferencePropertyComponent} from './value';
import {ObjectReferencePropertyComponent} from './object';
import {LazyReferencePropertyComponent} from './lazy';
import {PropertyModule} from '../property';
import {ObjectModule} from '../property/object';
import {ArrayModule} from '../property/array';
import {FunctionModule} from '../property/function';
import {ValueModule} from '../property/value';

@NgModule({
  declarations: [
    ReferencePropertyComponent,
    ValueReferencePropertyComponent,
    ObjectReferencePropertyComponent,
    LazyReferencePropertyComponent,
  ],
  exports: [
    ReferencePropertyComponent,
  ],
  imports: [
    CommonModule,
    PropertyModule,
    ObjectModule,
    ArrayModule,
    FunctionModule,
    ValueModule,
  ]
})
export class ReferencePropertyModule {
}