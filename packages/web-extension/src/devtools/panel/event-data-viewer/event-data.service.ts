import {Injectable} from '@angular/core';
import {browser} from '../../../types/webextension-polyfill-ts';

@Injectable({
  providedIn: 'root'
})
export class EventDataService {
  loadEventData(valueRef: number): Promise<any> {
    return browser.devtools.inspectedWindow.eval(`_dRxJS.getValueRefDat(${valueRef})`)
      .then(value => {
        if (value[1] && (value[1].isException || value[1].isError)) {
          throw new Error(value[1].value)
        }

        return value[0];
      });
  }
}
