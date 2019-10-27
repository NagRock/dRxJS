import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Property, ObjectReference, ValueReference} from '@drxjs/events';
import {RefsStorageService} from '../refs-storage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dr-property-explorer-object',
  templateUrl: './property-explorer-object.component.html',
  styleUrls: ['./property-explorer-object.component.scss'],
})
export class PropertyExplorerObjectComponent {

  @Input()
  name: string;

  @Input()
  reference: ObjectReference;

  @Input()
  enumerable: boolean;

  expanded = false;
  properties: Property[];

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
