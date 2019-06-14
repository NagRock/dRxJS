import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Observable, of, pipe} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

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

let id = 0;

(window as any).__instrument__ = (operator, fileName, expr, line, char, isLast: string) => {
  return (stream) => {
    return pipe(
      map((x: any) => {
        if (!x.__id__) {
          console.log('WITHOUD ID', x);
          x = {
            __value__: x,
          };
          x.__id__ = GENERATE_ID();
        }
        x.__file__ = fileName;
        x.__expr__ = expr;
        x.__line__ = line;
        x.__char__ = char;
        console.log('Before', expr, fileName + ':' + line, 'Value:', x.__value__, 'Id:', x.__id__);
        return x;
      }),
      switchMap((prevValue: any) => {
        // console.log('CREATE FUNC');
        return of(prevValue.__value__).pipe(
          operator,
          map(x => {
            return {
              __id__: prevValue.__id__,
              __value__: x,
              __file__: prevValue.__file__,
              __expr__: prevValue.__expr__,
              __line__: prevValue.__line__,
              __char__: prevValue.__char__,
            };
          })
        );
      }),
      map((x: any) => {
        if (isLast === 'true') {
          return x.__value__;
        }
        console.log('After', x.__expr__, x.__file__ + ':' + x.__line__, 'Value:', x.__value__, 'Id:', x.__id__);

        return {
          __id__: x.__id__,
          __value__: x.__value__,
          __file__: x.__file__,
          __expr__: x.__expr__,
          __line__: x.__line__,
          __char__: x.__char__,
        };
      })
    )(stream);

  };
};

const GENERATE_ID = function() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};


// map((x: any) => {
//
//   console.log('a');
//   if (!x.__id__) {
//     x = {
//       __value__: x,
//     };
//     x.__id__ = Math.random();
//   }
//   console.log('before', x);
//   return x;
// }),
// switchMap((prevVal: any) => operator(stream).pipe(
//   map(x => {
//     console.log('map', x);
//     return {
//       __id__: prevVal.__id__,
//       __value__: x,
//     };
//   })
// )),
// map((x: any) => {
//   console.log('after:', x);
//   return {__value__: x.__value__, __id__: x.__id__};
// })
// )(stream);
