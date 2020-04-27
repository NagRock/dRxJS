import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {LazyReference, Reference} from '@doctor-rxjs/events';
import {ReferenceService} from '../reference.service';
import {PROPERTY_VALUE} from '../../property';

@Component({
  selector: 'dr-lazy-reference-property',
  templateUrl: './lazy-reference-property.component.html',
  styleUrls: ['./lazy-reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyReferencePropertyComponent {

  evaluationResult: Reference;
  evaluationError: any;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: LazyReference,
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
