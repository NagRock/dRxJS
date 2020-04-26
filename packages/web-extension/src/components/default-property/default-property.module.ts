import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultPropertyComponent} from './default-property.component';
import {ValueModule} from '../property/value';
import {ObjectModule} from '../property/object';
import {ArrayModule} from '../property/array';
import {FunctionModule} from '../property/function';
import {PROPERTY_COMPONENT, PropertyModule} from '../property';

@NgModule({
  declarations: [DefaultPropertyComponent],
  entryComponents: [DefaultPropertyComponent],
  imports: [
    CommonModule,
    ValueModule,
    ObjectModule,
    ArrayModule,
    FunctionModule,
    PropertyModule,
  ]
})
export class DefaultPropertyModule {
  static forRoot(): ModuleWithProviders<DefaultPropertyModule> {
    return {
      ngModule: DefaultPropertyModule,
      providers: [
        {provide: PROPERTY_COMPONENT, multi: true, useValue: DefaultPropertyComponent},
      ],
    };
  }
}
