import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {LazyReference, Reference} from '@drxjs/events';
import {RefsStorageService} from '../../properties/refs-storage.service';

@Component({
  selector: 'dr-lazy-reference-property',
  templateUrl: './lazy-reference-property.component.html',
  styleUrls: ['./lazy-reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyReferencePropertyComponent {

  @Input()
  name: string;

  @Input()
  enumerable: boolean;

  @Input()
  reference: LazyReference;

  constructor(
    private readonly refs: RefsStorageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  evaluationResult: Reference;
  evaluationError: any;

  async evaluate() {
    try {
      this.evaluationResult = await this.refs.evalLazy(this.reference.ref, this.reference.property);
    } catch (error) {
      this.evaluationError = error;
    }
    this.cdr.markForCheck();
  }
}