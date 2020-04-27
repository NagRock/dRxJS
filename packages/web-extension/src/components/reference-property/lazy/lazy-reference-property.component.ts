import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {ReferenceService} from '../../../app/services/reference.service';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {LazyRef, Ref} from '../../../app/model/model';

@PropertyComponentClass()
@Component({
  selector: 'dr-lazy-reference-property',
  templateUrl: './lazy-reference-property.component.html',
  styleUrls: ['./lazy-reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyReferencePropertyComponent {

  static readonly TEST = (value) => value instanceof LazyRef;

  evaluationResult: Ref;
  evaluationError: any;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: LazyRef,
    private readonly refs: ReferenceService,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  async evaluate() {
    try {
      this.evaluationResult = await this.refs.evalLazy(this.reference.ref, this.reference.property);
    } catch (error) {
      this.evaluationError = error;
    }
    this.cdr.markForCheck();
  }
}
