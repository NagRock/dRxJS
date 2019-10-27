import {Injectable} from '@angular/core';
import {ObjectProperty} from '@drxjs/events';
import {browser} from '../../../../types/webextension-polyfill-ts';

@Injectable({
  providedIn: 'root',
})
export class RefsStorageService {
  get(ref: number): Promise<ObjectProperty[]> {
    return browser.devtools.inspectedWindow.eval(`__doctor__refs.get(${ref})`)
      .then(value => {
        if (value[1] && (value[1].isException || value[1].isError)) {
          throw new Error(value[1].value)
        }

        return value[0];
      });
  }
}
