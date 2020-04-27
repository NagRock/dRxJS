import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultPropertyComponent} from './default-property.component';
import {ValueModule} from '../property/value';
import {ObjectModule} from '../property/object';
import {ArrayModule} from '../property/array';
import {FunctionModule} from '../property/function';
import {LazyModule, PROPERTY_COMPONENT, PropertyModule} from '../property';
import { DefaultLazyPropertyComponent } from './lazy/default-lazy-property.component';

@NgModule({
  declarations: [DefaultPropertyComponent, DefaultLazyPropertyComponent],
  entryComponents: [DefaultPropertyComponent, DefaultLazyPropertyComponent],
  imports: [
    CommonModule,
    ValueModule,
    ObjectModule,
    ArrayModule,
    FunctionModule,
    PropertyModule,
    LazyModule,
  ]
})
export class DefaultPropertyModule {
  static forRoot(): ModuleWithProviders<DefaultPropertyModule> {
    return {
      ngModule: DefaultPropertyModule,
      providers: [
        {provide: PROPERTY_COMPONENT, multi: true, useValue: DefaultPropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: DefaultLazyPropertyComponent},
      ],
    };
  }
}
