import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PropertyModule} from '../../packages/web-extension/src/components/property';
import {SpecialModule} from '../../packages/web-extension/src/components/property/special';
import {ValueModule} from '../../packages/web-extension/src/components/property/value';
import {ArrayModule} from '../../packages/web-extension/src/components/property/array';
import {InstancePropertyComponent} from './instance-property';
import {EventPropertyComponent} from './event-property';
import {DefinitionPropertyComponent} from './definition-property';
import {ReferencePropertyModule} from '../../packages/web-extension/src/components/reference-property';

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
