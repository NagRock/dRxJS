import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Property} from '../../property';
import {DATA} from '../../property';
import {ValueReference} from '@doctor-rxjs/events';

@Property()
@Component({
  selector: 'dr-value-reference-property',
  templateUrl: './value-reference-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueReferencePropertyComponent {

  static readonly TYPE = 'value-reference';

  constructor(
    @Inject(DATA) readonly reference: ValueReference,
  ) {
  }
}
