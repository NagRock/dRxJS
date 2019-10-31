import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Event} from '../state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event-data-viewer',
  templateUrl: './event-data-viewer.component.html',
  styleUrls: ['./event-data-viewer.component.css']
})
export class EventDataViewerComponent {

  @Input()
  event: Event

}
