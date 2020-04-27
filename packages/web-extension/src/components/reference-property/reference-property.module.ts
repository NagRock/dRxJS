import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValueReferencePropertyComponent} from './value';
import {ObjectReferencePropertyComponent} from './object';
import {LazyReferencePropertyComponent} from './lazy';
import {LazyModule, PROPERTY_COMPONENT, PropertyModule} from '../property';
import {ObjectModule} from '../property/object';
import {ArrayModule} from '../property/array';
import {FunctionModule} from '../property/function';
import {ValueModule} from '../property/value';
import {ObservableReferencePropertyComponent} from './observable';
import {SpecialModule} from '../property/special';

@NgModule({
  declarations: [
    ValueReferencePropertyComponent,
    ObjectReferencePropertyComponent,
    LazyReferencePropertyComponent,
    ObservableReferencePropertyComponent,
  ],
  entryComponents: [
    ValueReferencePropertyComponent,
    ObjectReferencePropertyComponent,
    LazyReferencePropertyComponent,
    ObservableReferencePropertyComponent,
  ],
  imports: [
    CommonModule,
    PropertyModule,
    ObjectModule,
    ArrayModule,
    FunctionModule,
    ValueModule,
    SpecialModule,
    LazyModule,
  ]
})
export class ReferencePropertyModule {
  static forRoot(): ModuleWithProviders<ReferencePropertyModule> {
    return {
      ngModule: ReferencePropertyModule,
      providers: [
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ValueReferencePropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ObjectReferencePropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: LazyReferencePropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ObservableReferencePropertyComponent},
      ]
    };
  }
}
