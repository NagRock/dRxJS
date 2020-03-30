// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// import {enableInstrumentation} from '@drxjs';
import * as rxjs from 'rxjs';
import * as rxjsOperators from 'rxjs/operators';
import {instrument} from '@doctor-rxjs/instrumentation';


export const environment = {
  production: false
};

console.log('INSTRUMENTING DEMO APP');
(window as any).__doctor_rxjs__instrument && (window as any).__doctor_rxjs__instrument(rxjs, rxjsOperators);
instrument(rxjs, rxjsOperators);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
