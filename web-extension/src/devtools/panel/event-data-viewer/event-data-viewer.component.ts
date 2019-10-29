import {Component, Input} from '@angular/core';
import {Event} from '../state';

@Component({
  selector: 'app-event-data-viewer',
  templateUrl: './event-data-viewer.component.html',
  styleUrls: ['./event-data-viewer.component.css']
})
export class EventDataViewerComponent {
  @Input()
  event: Event;
}
