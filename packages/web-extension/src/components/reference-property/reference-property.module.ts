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
import { ObservableReferencePropertyComponent } from './observable';
import {SpecialModule} from '../property/special';

@NgModule({
  declarations: [
    ReferencePropertyComponent,
    ValueReferencePropertyComponent,
    ObjectReferencePropertyComponent,
    LazyReferencePropertyComponent,
    ObservableReferencePropertyComponent,
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
    SpecialModule,
  ]
})
export class ReferencePropertyModule {
}
