import {Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {Event} from '../state';

@Component({
  selector: 'app-events-viewer',
  templateUrl: './events-viewer.component.html',
  styleUrls: ['./events-viewer.component.scss']
})
export class EventsViewerComponent {

  selectedEventIndex: number;

  @ViewChildren('item', {read: ElementRef})
  items: QueryList<ElementRef<HTMLElement>>;

  @Input()
  events: Event[];

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
