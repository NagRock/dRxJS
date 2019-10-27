import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {LazyReference, Reference} from '@drxjs/events';
import {RefsStorageService} from '../refs-storage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-property-explorer-lazy',
  templateUrl: './property-explorer-lazy.component.html',
  styleUrls: ['./property-explorer-lazy.component.scss'],
})
export class PropertyExplorerLazyComponent {

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
