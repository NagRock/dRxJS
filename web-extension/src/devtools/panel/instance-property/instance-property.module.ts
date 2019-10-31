import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InstancePropertyComponent} from './instance-property.component';
import {PropertyModule} from '../property';
import {SpecialModule} from '../property/special';
import {ValueModule} from '../property/value';
import {DefinitionPropertyModule} from '../definition-property';
import {ArrayModule} from '../property/array';

@NgModule({
  declarations: [InstancePropertyComponent],
  exports: [
    InstancePropertyComponent,
  ],
  imports: [
    CommonModule,
    PropertyModule,
    SpecialModule,
    ValueModule,
    DefinitionPropertyModule,
    ArrayModule,
  ]
})
export class InstancePropertyModule {
}
