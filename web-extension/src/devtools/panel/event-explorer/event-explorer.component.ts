import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Event} from '../state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-event-explorer',
  templateUrl: './event-explorer.component.html',
  styleUrls: ['./event-explorer.component.scss']
})
export class EventExplorerComponent {

  @Input()
  name: string;

  @Input()
  event: Event;
}
