import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventPropertyComponent} from './event-property.component';
import {PropertyModule} from '../property';
import {SpecialModule} from '../property/special';
import {ValueModule} from '../property/value';
import {ReferencePropertyModule} from '../reference-property';
import {InstancePropertyModule} from '../instance-property';

@NgModule({
  declarations: [EventPropertyComponent],
  exports: [
    EventPropertyComponent,
  ],
  imports: [
    CommonModule,
    PropertyModule,
    SpecialModule,
    ValueModule,
    ReferencePropertyModule,
    InstancePropertyModule,
  ]
})
export class EventPropertyModule {
}
