import {Injectable} from '@angular/core';
import {Property, Reference} from '@doctor-rxjs/events';
import {inspectedWindowEval} from 'src/app/utils/inspected-window-eval';
import {LazyRef, ObjectRef, ObservableRef, Ref, ValueRef} from '../model/model';

export interface Prop {
  readonly name: string;
  readonly enumerable: boolean;
  readonly reference: Ref;
}

export function createRef(reference: Reference): Ref {
  switch (reference.kind) {
    case 'value':
      return new ValueRef(reference.value);
    case 'object':
      return new ObjectRef(reference.type, reference.name, reference.size, reference.ref);
    case 'lazy':
      return new LazyRef(reference.ref, reference.property);
    case 'observable':
      return new ObservableRef(reference.id);
  }
}

export function createRefs(references: Reference[]): Ref[] {
  return references.map(createRef);
}

@Injectable({
  providedIn: 'root',
})
export class ReferenceService {
  async get(ref: number): Promise<Prop[]> {
    const properties: Property[] = await inspectedWindowEval(`__doctor_rxjs__.getRef(${ref})`);
    return properties.map(({name, enumerable, reference}) => ({name, enumerable, reference: createRef(reference)}));
  }

  async evalLazy(ref: number, property: string): Promise<Ref> {
    const reference: Reference = await inspectedWindowEval(`__doctor_rxjs__.getRefLazyProperty(${ref}, '${property}')`);
    return createRef(reference);
  }
}
