import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ValueReference} from '@doctor-rxjs/events';

@Component({
  selector: 'dr-value-reference-property',
  templateUrl: './value-reference-property.component.html',
  styleUrls: ['./value-reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueReferencePropertyComponent {

  @Input()
  name: string;

  @Input()
  enumerable: boolean;

  @Input()
  reference: ValueReference;
}
