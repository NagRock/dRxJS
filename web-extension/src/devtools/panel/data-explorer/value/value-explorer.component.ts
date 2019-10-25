import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {ValueReference} from '@drxjs/events';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'd-value-explorer',
  template: `{{value}}`,
  styleUrls: ['./value-explorer.component.css'],
})
export class ValueExplorerComponent {

  @Input()
  data: ValueReference;

  get value() {
    const value = this.data.value;
    return typeof value === 'symbol' ? value.toString() : `${value}`;
  }

  @HostBinding('class')
  get type() {
    const value = this.data.value;
    if (value === null) {
      return 'null';
    } else {
      return typeof value;
    }
  }
}
