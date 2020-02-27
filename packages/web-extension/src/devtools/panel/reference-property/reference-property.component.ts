import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Reference} from '@doctor-rxjs/protocol';

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
  enumerable: boolean = true;

  @Input()
  reference: Reference;
}
