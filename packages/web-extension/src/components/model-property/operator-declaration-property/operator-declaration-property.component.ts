import {Component, Inject} from '@angular/core';
import {ConstructorDeclaration, OperatorDeclaration} from '../../../app/model';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';

@PropertyComponentClass()
@Component({
  selector: 'dr-operator-declaration-property',
  templateUrl: './operator-declaration-property.component.html',
  styles: []
})
export class OperatorDeclarationPropertyComponent {

  static readonly TEST = (value) => value instanceof OperatorDeclaration;

  constructor(
    @Inject(PROPERTY_VALUE) readonly declaration: OperatorDeclaration,
  ) {
  }

}
