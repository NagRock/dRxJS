import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ObjectReference, Property} from '@doctor-rxjs/events';
import {defer, Observable} from 'rxjs';
import {ReferenceService} from '../reference.service';
import {shareReplay} from 'rxjs/operators';
import {PROPERTY_VALUE, Property as PropertyDecorator} from '../../property';

@PropertyDecorator()
@Component({
  selector: 'dr-object-reference-property',
  templateUrl: './object-reference-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectReferencePropertyComponent {

  static readonly TYPE = 'object-reference';

  properties: Observable<Property[]>;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: ObjectReference,
    private readonly refs: ReferenceService,
  ) {
    this.properties = defer(() => this.refs.get(reference.ref)).pipe(shareReplay(1));
  }

}
