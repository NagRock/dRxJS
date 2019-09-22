import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Event, Instance} from '../state';

@Component({
  selector: 'app-instance-selector',
  templateUrl: './instance-selector.component.html',
  styleUrls: ['./instance-selector.component.css']
})
export class InstanceSelectorComponent {

  @Input()
  instance: Instance;

  @Output()
  readonly instanceChange = new EventEmitter<Instance>();
}
