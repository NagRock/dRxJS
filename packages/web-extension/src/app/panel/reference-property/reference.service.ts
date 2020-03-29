import {Injectable} from '@angular/core';
import {Property, Reference} from '@doctor-rxjs/events';
import {inspectedWindowEval} from '../inspected-window-eval';

@Injectable({
  providedIn: 'root',
})
export class ReferenceService {
  get(ref: number): Promise<Property[]> {
    return inspectedWindowEval(`__doctor__refs.get(${ref})`);
  }

  evalLazy(ref: number, property: string): Promise<Reference> {
    return inspectedWindowEval(`__doctor__refs.evalLazy(${ref}, '${property}')`);
  }
}
