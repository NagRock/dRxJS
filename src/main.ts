import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Observable, pipe} from "rxjs";
import {tap} from "rxjs/operators";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

const streamsByLocation: { [location: string]: Observable<any>[] } = (window as any).__streams__ = {};

const getStreamsByLocation = (fileName: any, line: any, char: any) => {
  const location = `${fileName}:${line}:${char}`;
  const streams = streamsByLocation[location];
  if (streams !== undefined) {
    return streams;
  } else {
    return streamsByLocation[location] = [];
  }
};

const addStreamByLocation = (fileName: any, line: any, char: any, stream: any) => {
  getStreamsByLocation(fileName, line, char).push(stream);
};

let ID = 0;

(window as any).__instrument__ = (operator, fileName, expr, line, char) => {
  return (stream) => {
    console.log('creating operator: ', expr);
    let before;
    let after;
    return pipe(
      (x) => {
        before = x;
        before.__id__ = before.__id__ || ID++;
        return before;
      },
      operator,
      (x) => {
        after = (x as any).pipe(tap((value) => {
          const val = {stream: after,  value};
          if (before.__values__) {
            const lastValue = before.__values__[before.__values__.length - 1];
            lastValue.caused = lastValue.caused || [];
            lastValue.caused.push(val);
          }
          after.__values__.push(val);
        }));
        after.__values__ = [];
        after.__location__ = `${fileName}:${line}:${char}`;
        after.__expression__ = expr;
        addStreamByLocation(fileName, line, char, after);
        return after;
      },
    )(stream);
  };
};

