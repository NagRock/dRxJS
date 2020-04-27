import {Component, Inject} from '@angular/core';
import {PROPERTY_VALUE, PropertyComponentClass} from '../property';
import {Reference} from '@doctor-rxjs/events';

@PropertyComponentClass()
@Component({
  selector: 'dr-reference-property',
  template: `
    <ng-container [ngSwitch]="reference.kind">
        <dr-lazy-reference-property *ngSwitchCase="'lazy'"></dr-lazy-reference-property>
        <dr-object-reference-property *ngSwitchCase="'object'"></dr-object-reference-property>
        <dr-observable-reference-property *ngSwitchCase="'observable'"></dr-observable-reference-property>
        <dr-value-reference-property *ngSwitchCase="'value'"></dr-value-reference-property>
    </ng-container>
  `,
  styles: []
})
export class ReferencePropertyComponent {

  static readonly REFERENCE_KINDS = [
    'lazy',
    'object',
    'observable',
    'value',
  ];
  static readonly TEST = (value) => value && ReferencePropertyComponent.REFERENCE_KINDS.includes(value.kind) ? 1 : undefined;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: Reference,
  ) {
  }
}
