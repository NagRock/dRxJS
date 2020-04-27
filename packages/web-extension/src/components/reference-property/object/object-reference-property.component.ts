import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {defer, Observable} from 'rxjs';
import {Prop, ReferenceService} from '../../../app/services/reference.service';
import {shareReplay} from 'rxjs/operators';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {ObjectRef} from '../../../app/model/model';

@PropertyComponentClass()
@Component({
  selector: 'dr-object-reference-property',
  templateUrl: './object-reference-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectReferencePropertyComponent {

  static readonly TEST = (value) => value instanceof ObjectRef;

  properties: Observable<Prop[]>;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: ObjectRef,
    private readonly refs: ReferenceService,
  ) {
    this.properties = defer(() => this.refs.get(reference.ref)).pipe(shareReplay(1));
  }

}
