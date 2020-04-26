import {Component, Inject} from '@angular/core';
import {PROPERTY_VALUE, Property} from '../property';
import {Reference} from '@doctor-rxjs/events';

@Property()
@Component({
  selector: 'dr-reference-property',
  template: `
    <dr-property-outlet [type]="reference.kind + '-reference'" [data]="reference"></dr-property-outlet>
  `,
  styles: []
})
export class ReferencePropertyComponent {

  static readonly TYPE = 'reference';

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: Reference,
  ) {
  }
}
