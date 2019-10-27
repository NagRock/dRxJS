import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Reference} from '@drxjs/events';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-property-explorer',
  templateUrl: './property-explorer.component.html',
  styleUrls: ['./property-explorer.component.scss'],
})
export class PropertyExplorerComponent {
  @Input()
  name: string;

  @Input()
  reference: Reference;

  @Input()
  enumerable: boolean;
}
