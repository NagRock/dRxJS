import {Component, Inject} from '@angular/core';
import {ObservableFromOperator} from '../../../app/model/model';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {getObservablesChain} from '../../../app/model';

@PropertyComponentClass()
@Component({
  selector: 'dr-observable-from-operator-property',
  templateUrl: './observable-from-operator-property.component.html',
})
export class ObservableFromOperatorPropertyComponent {

  static readonly TEST = (value) => value instanceof ObservableFromOperator;

  readonly name: string;

  constructor(
    @Inject(PROPERTY_VALUE) readonly observable: ObservableFromOperator,
  ) {
    this.name = getObservablesChain(observable).join(` ${String.fromCharCode(0x2192)} `);
  }

}
