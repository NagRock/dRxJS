import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {ObjectProperty, ValueReference} from '@drxjs/events';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'd-value-ref-explorer',
  template: `<span class="property-name" [ngClass]="{enumerable: enumerable}">{{name}}</span><span [ngClass]="type">{{value}}</span>`,
  styleUrls: ['./value-ref-explorer.component.css'],
})
export class ValueRefExplorerComponent {

  @Input()
  name: string;

  @Input()
  reference: ValueReference;

  @Input()
  enumerable: boolean;

  get value() {
    const value = this.reference.value;
    return typeof value === 'symbol' ? value.toString() : `${value}`;
  }

  get type() {
    const value = this.reference.value;
    if (value === null) {
      return 'null';
    } else {
      return typeof value;
    }
  }
}
