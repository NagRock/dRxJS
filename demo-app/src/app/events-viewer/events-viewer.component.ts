import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Event} from '../state';

@Component({
  selector: 'app-events-viewer',
  templateUrl: './events-viewer.component.html',
  styleUrls: ['./events-viewer.component.css']
})
export class EventsViewerComponent {

  @Input()
  events: Event[];

  @Input()
  selectedEventIndex: number;

  @Output()
  readonly selectedEventIndexChange = new EventEmitter<number>();

  onEventClicked(index: number) {
    this.selectedEventIndex = index;
    this.selectedEventIndexChange.emit(index);
  }
}
