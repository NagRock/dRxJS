import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ValueReference} from '@drxjs/events';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-property-explorer-value',
  template: `
      <dr-property [name]="name" [variant]="enumerable ? 'primary' : 'secondary'">
          <span [ngClass]="type">{{value}}</span>
      </dr-property>
  `,
  styleUrls: ['./property-explorer-value.component.scss'],
})
export class PropertyExplorerValueComponent {

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
