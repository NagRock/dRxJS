import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefinitionPropertyComponent} from './definition-property.component';
import {PropertyModule} from '../property';
import {SpecialModule} from '../property/special';
import {ValueModule} from '../property/value';
import {ReferencePropertyModule} from '../reference-property';
import {ArrayModule} from '../property/array';
import {InstancePropertyModule} from '../instance-property';

@NgModule({
  declarations: [DefinitionPropertyComponent],
  exports: [
    DefinitionPropertyComponent,
  ],
  imports: [
    CommonModule,
    PropertyModule,
    SpecialModule,
    ValueModule,
    ReferencePropertyModule,
    ArrayModule,
    InstancePropertyModule,
  ]
})
export class DefinitionPropertyModule {
}
