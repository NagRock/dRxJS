import {Component, Inject} from '@angular/core';
import {SubscribeDeclaration} from '../../../app/model';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';

@PropertyComponentClass()
@Component({
  selector: 'dr-subscribe-declaration-property',
  templateUrl: './subscribe-declaration-property.component.html',
  styles: []
})
export class SubscribeDeclarationPropertyComponent {

  static readonly TEST = (value) => value instanceof SubscribeDeclaration;

  constructor(
    @Inject(PROPERTY_VALUE) readonly declaration: SubscribeDeclaration,
  ) {
  }

}
