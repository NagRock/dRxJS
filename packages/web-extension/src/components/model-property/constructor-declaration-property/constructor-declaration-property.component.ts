import {Component, Inject} from '@angular/core';
import {ConstructorDeclaration} from '../../../app/model';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';

@PropertyComponentClass()
@Component({
  selector: 'dr-operator-declaration-property',
  templateUrl: './constructor-declaration-property.component.html',
  styles: []
})
export class ConstructorDeclarationPropertyComponent {

  static readonly TEST = (value) => value instanceof ConstructorDeclaration;

  constructor(
    @Inject(PROPERTY_VALUE) readonly declaration: ConstructorDeclaration,
  ) {
  }

}
