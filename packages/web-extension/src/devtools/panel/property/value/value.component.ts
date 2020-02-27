import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Value} from '@doctor-rxjs/protocol';

@Component({
  selector: 'dr-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueComponent {

  @Input()
  value: Value;

  getValue() {
    return typeof this.value === 'symbol' ? this.value.toString() : `${this.value}`;
  }

  getValueType() {
    if (this.value === null) {
      return 'null';
    } else {
      return typeof this.value;
    }
  }
}
