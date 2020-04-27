import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {ValueRef} from '../../../app/model/model';

@PropertyComponentClass()
@Component({
  selector: 'dr-value-reference-property',
  templateUrl: './value-reference-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueReferencePropertyComponent {

  static readonly TEST = (value) => value instanceof ValueRef;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: ValueRef,
  ) {
  }
}
