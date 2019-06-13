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

const streamsByLocation: {[location: string]: Observable<any>[]} = (window as any).__streams__ = {};

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

let id = 0;

(window as any).__instrument__ = (operator, fileName, expr, line, char) => {
  return (stream) => {
    addStreamByLocation(fileName, line, char, stream);
    stream.__interactions__ = stream.__interactions__ || [];
    stream.__id__ = stream.__id__ || id++;
    console.log('created stream', stream, stream.__id__);
    let before;
    let after;
    return pipe(
      (x) => {before = x; return x;},
      operator,
      (x) => {after = (x as any).pipe(tap((value) => console.log({before, after, value}))); return after;},
    )(stream);
  };
};

