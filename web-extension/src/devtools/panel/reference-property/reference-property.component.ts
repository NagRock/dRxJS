import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Reference} from '@drxjs/events';

@Component({
  selector: 'dr-reference-property',
  templateUrl: './reference-property.component.html',
  styleUrls: ['./reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencePropertyComponent {

  @Input()
  name: string;

  @Input()
  enumerable: boolean;

  @Input()
  reference: Reference;
}
