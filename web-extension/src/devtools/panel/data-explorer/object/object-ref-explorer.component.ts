import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ObjectProperty, ObjectReference, ValueReference} from '@drxjs/events';
import {RefsStorageService} from '../refs-storage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'd-object-ref-explorer',
  templateUrl: './object-ref-explorer.component.html',
  styleUrls: ['./object-ref-explorer.component.scss'],
})
export class ObjectRefExplorerComponent {

  @Input()
  name: string;

  @Input()
  reference: ObjectReference;

  @Input()
  enumerable: boolean;

  expanded = false;
  properties: ObjectProperty[];

  constructor(
    private readonly refsStorageService: RefsStorageService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  toggle() {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  private async expand() {
    if (!this.properties) {
      this.properties = await this.refsStorageService.get(this.reference.ref);
    }
    this.expanded = true;
    this.changeDetectorRef.markForCheck();
  }

  private collapse() {
    this.expanded = false;
    this.changeDetectorRef.markForCheck();
  }
}
