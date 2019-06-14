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

export interface StreamData {
  id: number;
  location: {
    file: string,
    line: number,
    char: number,
  };
  expression: string;
  values: number[];
}

export interface ValueData {
  id: number;
  timestamp: number;
  value: unknown;
  from: number;
  to: number;
}

export interface Data {
  streams: StreamData[];
  values: ValueData[];
}

export const data: Data = (window as any).__data__ = {
  streams: [],
  values: [],
};


let streamDataId = 0;
function trackStreamData(expr, file, line, char) {
  const streamData = {
    id: streamDataId++,
    expression: expr,
    location: {file, line, char},
    values: [],
  };
  data.streams[streamData.id] = streamData;
  return streamData;
}

let valueDataId = 0;
function trackValueData(value, from, to) {
  const valueData = {
    id: valueDataId++,
    timestamp: Date.now(),
    value,
    from,
    to,
  };
  data.values[valueData.id] = valueData;
  return valueData;
}

function getDestination(observer: any) {
  return observer.__id__ !== undefined
    ? data.streams[observer.__id__]
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : trackStreamData('unknown', 'unknown', 0, 0);
}

(window as any).__instrument__ = (operator, file, expr, line, char) => {
  return pipe(
    operator,
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        console.log('instrumenting operator: ', expr);
        const source: StreamData = trackStreamData(expr, file, line, char);
        const destination: StreamData = getDestination(observer);
        observer.__id__ = source.id;
        const sub = stream
          .pipe(
            tap((x) => {

                const value = trackValueData(x, source.id, destination.id);
                source.values.push(value.id);

              }
            )
          )
          .subscribe(observer);

        return () => sub.unsubscribe();
      });
    });
};

