import {Component, Inject} from '@angular/core';
import {ObservableFromSubscribe} from '../../../app/model/model';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {getObservablesChain} from '../../../app/model';

@PropertyComponentClass()
@Component({
  selector: 'dr-observable-from-subscribe-property',
  templateUrl: './observable-from-subscribe-property.component.html',
})
export class ObservableFromSubscribePropertyComponent {

  static readonly TEST = (value) => value instanceof ObservableFromSubscribe;

  readonly name: string;

  constructor(
    @Inject(PROPERTY_VALUE) readonly observable: ObservableFromSubscribe,
  ) {
    this.name = getObservablesChain(observable).join(` ${String.fromCharCode(0x2192)} `);
  }

}
