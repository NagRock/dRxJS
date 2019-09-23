import {Component, Input} from '@angular/core';
import {Event} from '../state';
import {EventDataService} from './event-data.service';

@Component({
  selector: 'app-event-data-viewer',
  templateUrl: './event-data-viewer.component.html',
  styleUrls: ['./event-data-viewer.component.css']
})
export class EventDataViewerComponent {
  _event: Event;
  eventData: any;

  @Input()
  set event(event: Event) {
    this._event = event;

    if (event && !!(event as any).valueRef) {
      this.eventDataService.loadEventData((event as any).valueRef)
        .then((data) => this.eventData = data)
    } else {
      this.eventData = undefined;
    }
  }


  constructor(private readonly eventDataService: EventDataService) {
  }

  getEventDataType(eventData: any) {
    return typeof eventData;
  }
}
