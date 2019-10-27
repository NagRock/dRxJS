import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Reference} from '@drxjs/events';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'd-ref-explorer',
  templateUrl: './ref-explorer.component.html',
  styleUrls: ['./ref-explorer.component.scss'],
})
export class RefExplorerComponent {
  @Input()
  name: string;

  @Input()
  reference: Reference;

  @Input()
  enumerable: boolean;
}
