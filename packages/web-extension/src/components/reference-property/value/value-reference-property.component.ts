import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {ValueReference} from '@doctor-rxjs/events';

@Component({
  selector: 'dr-value-reference-property',
  templateUrl: './value-reference-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueReferencePropertyComponent {

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: ValueReference,
  ) {
  }
}
