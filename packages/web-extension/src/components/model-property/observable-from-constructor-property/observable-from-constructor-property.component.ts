import {Component, Inject} from '@angular/core';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {ObservableFromConstructor} from '../../../app/model/model';

@PropertyComponentClass()
@Component({
  selector: 'dr-observable-from-constructor-property',
  templateUrl: './observable-from-constructor-property.component.html',
})
export class ObservableFromConstructorPropertyComponent {

  static readonly TEST = (value) => value instanceof ObservableFromConstructor;

  constructor(
    @Inject(PROPERTY_VALUE) readonly observable: ObservableFromConstructor,
  ) {
  }

}
