import {Injectable} from '@angular/core';
import {Property, Reference} from '@doctor-rxjs/protocol';
import {browser} from '../../../types/webextension-polyfill-ts';

@Injectable({
  providedIn: 'root',
})
export class ReferenceService {
  get(ref: number): Promise<Property[]> {
    return browser.devtools.inspectedWindow.eval(`__doctor__refs.get(${ref})`)
      .then(value => {
        if (value[1] && (value[1].isException || value[1].isError)) {
          throw new Error(value[1].value)
        }

        return value[0];
      });
  }

  evalLazy(ref: number, property: string): Promise<Reference> {
    return browser.devtools.inspectedWindow.eval(`__doctor__refs.evalLazy(${ref}, '${property}')`)
      .then(value => {
        if (value[1] && (value[1].isException || value[1].isError)) {
          throw new Error(value[1].value)
        }

        return value[0];
      });
  }
}
