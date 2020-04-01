import {Injectable} from '@angular/core';
import {Property, Reference} from '@doctor-rxjs/events';
import {inspectedWindowEval} from '../inspected-window-eval';

@Injectable({
  providedIn: 'root',
})
export class ReferenceService {
  get(ref: number): Promise<Property[]> {
    return inspectedWindowEval(`__doctor_rxjs__.getRef(${ref})`);
  }

  evalLazy(ref: number, property: string): Promise<Reference> {
    return inspectedWindowEval(`__doctor_rxjs__.getRefLazyProperty(${ref}, '${property}')`);
  }
}
