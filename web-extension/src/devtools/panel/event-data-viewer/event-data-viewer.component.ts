import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Event} from '../state';
import {StatePropertiesService} from '../properties/state-properties.service';
import {PropertyNode} from '../property-node/property-node';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event-data-viewer',
  templateUrl: './event-data-viewer.component.html',
  styleUrls: ['./event-data-viewer.component.css']
})
export class EventDataViewerComponent {
  eventNode: PropertyNode;

  constructor(
    private readonly statePropertiesService: StatePropertiesService,
  ) {
  }

  @Input()
  set event(event: Event) {
    if (event) {
      this.eventNode = this.statePropertiesService.fromEvent('event', true, event);
    } else {
      this.eventNode = undefined;
    }
  }
}
