// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {enableInstrumentation} from '../instrument';
import {getState$} from '../app/state';
import {asapScheduler} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

export const environment = {
  production: false
};

const rxInspector = enableInstrumentation();

getState$(rxInspector)
  .pipe(debounceTime(0, asapScheduler))
  .subscribe((state) => {
    console.log(state);
  });

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
