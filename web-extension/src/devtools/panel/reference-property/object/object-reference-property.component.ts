import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ObjectReference, Property} from '@drxjs/events';
import {defer, Observable} from 'rxjs';
import {RefsStorageService} from '../../properties/refs-storage.service';
import {shareReplay} from 'rxjs/operators';

@Component({
  selector: 'dr-object-reference-property',
  templateUrl: './object-reference-property.component.html',
  styleUrls: ['./object-reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectReferencePropertyComponent {

  @Input()
  name: string;

  @Input()
  enumerable: boolean;

  @Input('reference')
  set referenceInput(reference: ObjectReference) {
    this.reference = reference;
    this.properties = defer(() => this.refs.get(reference.ref)).pipe(shareReplay(1));
  }

  reference: ObjectReference;
  properties: Observable<Property[]>;

  constructor(
    private readonly refs: RefsStorageService,
  ) {
  }

}
