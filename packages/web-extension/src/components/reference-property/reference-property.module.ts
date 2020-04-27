import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValueReferencePropertyComponent} from './value';
import {ObjectReferencePropertyComponent} from './object';
import {LazyReferencePropertyComponent} from './lazy';
import {PROPERTY_COMPONENT, PropertyModule} from '../property';
import {ObjectModule} from '../property/object';
import {ArrayModule} from '../property/array';
import {FunctionModule} from '../property/function';
import {ValueModule} from '../property/value';
import {ObservableReferencePropertyComponent} from './observable';
import {SpecialModule} from '../property/special';
import { ReferencePropertyComponent } from './reference-property.component';

@NgModule({
  declarations: [
    ReferencePropertyComponent,
    ValueReferencePropertyComponent,
    ObjectReferencePropertyComponent,
    LazyReferencePropertyComponent,
    ObservableReferencePropertyComponent,
  ],
  entryComponents: [
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
  static forRoot(): ModuleWithProviders<ReferencePropertyModule> {
    return {
      ngModule: ReferencePropertyModule,
      providers: [
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ReferencePropertyComponent},
      ]
    };
  }
}
