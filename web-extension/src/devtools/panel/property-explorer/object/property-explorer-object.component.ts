import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Property, ObjectReference, ValueReference} from '@drxjs/events';
import {RefsStorageService} from '../refs-storage.service';
import {defer, from, Observable} from 'rxjs';

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

  properties = defer(() => this.refsStorageService.get(this.reference.ref));

  constructor(
    private readonly refsStorageService: RefsStorageService,
  ) {
  }
}
