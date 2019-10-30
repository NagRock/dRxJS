import {Injectable} from '@angular/core';
import {LazyReference, ObjectReference, Reference, ValueReference} from '@drxjs/events';
import {PropertyLazyNode, PropertyLeafNode, PropertyNode, PropertyTreeNode} from '../property-node/property-node';
import {defer} from 'rxjs';
import {RefsStorageService} from '../property-explorer/refs-storage.service';
import {map} from 'rxjs/operators';
import {ValuePropertiesService} from './value-properties.service';


@Injectable({
  providedIn: 'root',
})
export class ReferencePropertiesService {

  constructor(
    private readonly valuePropertiesService: ValuePropertiesService,
    private readonly refsStorageService: RefsStorageService,
  ) {
  }

  fromReference(key: string, primary: boolean, reference: Reference): PropertyNode {
    switch (reference.kind) {
      case 'value':
        return this.fromValueReference(key, primary, reference);
      case 'object':
        return this.fromObjectReference(key, primary, reference);
      case 'lazy':
        return this.fromLazyReference(key, primary, reference);
    }
  }

  private fromValueReference(key: string, primary: boolean, reference: ValueReference): PropertyLeafNode {
    return this.valuePropertiesService.fromValue(key, primary, reference.value);
  }

  private fromObjectReference(key: string, primary: boolean, reference: ObjectReference): PropertyTreeNode {
    return {
      lazy: false,
      expandable: true,
      key,
      primary,
      value: reference.name,
      type: reference.type,
      prefix: reference.size !== undefined ? `(${reference.size}) ` : undefined,
      children: defer(() => this.refsStorageService.get(reference.ref))
        .pipe(
          map((properties) => properties.map(({name, enumerable, reference}) => this.fromReference(name, enumerable, reference))),
        ),
    };
  }

  private fromLazyReference(key: string, primary: boolean, reference: LazyReference): PropertyLazyNode {
    return {
      lazy: true,
      key,
      primary,
      eval: () =>
        defer(() => this.refsStorageService.evalLazy(reference.ref, reference.property))
          .pipe(
            map((evaluatedReference) => this.fromReference(key, primary, evaluatedReference)),
          )
    };
  }
}
