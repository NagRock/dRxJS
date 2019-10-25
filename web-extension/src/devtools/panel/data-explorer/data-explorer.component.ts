import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Definition, Instance} from '../state';
import {Event, Reference} from '@drxjs/events';

type Data
  = Definition
  | Instance
  | Event
  | Reference;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'd-data-explorer',
  templateUrl: './data-explorer.component.html',
  // styleUrls: ['./data-explorer.component.css'],
})
export class DataExplorerComponent {

  @Input()
  data: Data;

}
