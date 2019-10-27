import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {LazyReference, Reference} from '@drxjs/events';
import {RefsStorageService} from '../refs-storage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'd-lazy-ref-explorer',
  templateUrl: './lazy-ref-explorer.component.html',
  styleUrls: ['./lazy-ref-explorer.component.css'],
})
export class LazyRefExplorerComponent {

  @Input()
  name: string;

  @Input()
  reference: LazyReference;

  @Input()
  enumerable: boolean;

  evaluatedReference: Reference;
  evaluationError: string;

  constructor(
    private readonly refStorageService: RefsStorageService,
  ) {
  }

  async evaluate() {
    const {ref, property} = this.reference;
    try {
      this.evaluatedReference = await this.refStorageService.evalLazy(ref, property);
    } catch (e) {
      this.evaluationError = e.message;
    }
  }
}
