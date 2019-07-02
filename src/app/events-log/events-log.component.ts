import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventModel} from '../model';

@Component({
  selector: 'app-events-log',
  templateUrl: './events-log.component.html',
  styleUrls: ['./events-log.component.css']
})
export class EventsLogComponent {

  @Output()
  readonly eventClicked = new EventEmitter<EventModel>();

  @Output()
  readonly eventHighlighted = new EventEmitter<EventModel | undefined>();

  @Input()
  events: EventModel[];
}
