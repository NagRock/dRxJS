import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PropertyModule} from '../property';
import {SpecialModule} from '../property/special';
import {ValueModule} from '../property/value';
import {ArrayModule} from '../property/array';
import {InstancePropertyComponent} from './instance-property';
import {EventPropertyComponent} from './event-property';
import {DefinitionPropertyComponent} from './definition-property';
import {ReferencePropertyModule} from '../reference-property';

@NgModule({
  declarations: [
    EventPropertyComponent,
    InstancePropertyComponent,
    DefinitionPropertyComponent,
  ],
  exports: [
    EventPropertyComponent,
    InstancePropertyComponent,
    DefinitionPropertyComponent,
  ],
  imports: [
    CommonModule,
    PropertyModule,
    SpecialModule,
    ValueModule,
    ArrayModule,
    ReferencePropertyModule,
  ]
})
export class StatePropertyModule {
}
