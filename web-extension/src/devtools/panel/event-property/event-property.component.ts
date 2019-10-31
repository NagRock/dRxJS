import {ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef} from '@angular/core';
import {Event} from '../state';

@Component({
  selector: 'dr-event-property',
  templateUrl: './event-property.component.html',
  styleUrls: ['./event-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventPropertyComponent {

  @Input()
  key: string;

  @Input()
  event: Event;

  get value() {
    return this.event.kind.replace(/-/g, ' ').replace(/^./, (s) => s.toUpperCase());
  }

  get suffix() {
    return 'id' in this.event ? ` #${this.event.id}` : '';
  }
}
