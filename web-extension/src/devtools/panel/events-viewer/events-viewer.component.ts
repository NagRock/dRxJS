import {Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {Event, Task} from '../state';
import * as R from 'ramda';

interface IndexedEvent {
  index: number;
  event: Event;
}

interface EventsGroup {
  task: Task;
  events: IndexedEvent[];
}

@Component({
  selector: 'app-events-viewer',
  templateUrl: './events-viewer.component.html',
  styleUrls: ['./events-viewer.component.scss']
})
export class EventsViewerComponent {

  selectedEventIndex: number;
  tasks: EventsGroup[];

  @ViewChildren('item', {read: ElementRef})
  items: QueryList<ElementRef<HTMLElement>>;

  @Input()
  set events(events: Event[]) {
    if (events) {
      const groupWith = R.groupWith((x: IndexedEvent, y: IndexedEvent) => x.event.task === y.event.task);
      this.tasks = groupWith(events.map((event, index) => ({event, index}))).map((events) => ({task: events[0].event.task, events}));
    } else {
      this.tasks = [];
    }
    console.log('tasks:', this.tasks)
  }

  @Input('selectedEventIndex')
  set selectedEventIndexInput(value: number) {
    this.selectedEventIndex = value;
    if (this.items) {
      const selectedItem = this.items.find((_, i) => i === value);
      if (selectedItem) {
        selectedItem.nativeElement.scrollIntoView({behavior: 'smooth', inline: 'center'});
      }
    }
  }

  @Output()
  readonly selectedEventIndexChange = new EventEmitter<number>();

  setSelectedEventIndex(index: number) {
    this.selectedEventIndex = index;
    this.selectedEventIndexChange.emit(index);
  }

  getEventName(event: Event) {
    return event.kind.replace(/-/g, ' ').replace(/^./, (s) => s.toUpperCase());
  }

}
