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

function getDestination(observer: any) {
  return observer.__id__ !== undefined
    ? observer
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : undefined;
}

(window as any).__instrument__ = (operator, fileName, expr, line, char) => {
  return pipe(
    operator,
    (stream) => {
      return Observable.create((observer) => {
        const destination = getDestination(observer);
        const id = ID++;
        const location = `${fileName}:${line}:${char}`;
        observer.__id__ = id;
        observer.__location__ = location;
        observer.__expression__ = expr;
        observer.__values__ = [];
        observer.__source_values__ = [];
        console.log('instrumenting operator: ', expr, observer);
        addStreamByLocation(fileName, line, char, observer);
        const sub = stream
          .pipe(
            tap((x) => {
              // in
              const value = {
                value: x,
                stream: {
                  id, location, expr,
                },
                caused: [],
              };

              if (observer.__source_values__.length !== 0) {
                observer.__source_values__.shift().caused.push(value);
              }

              observer.__values__.push(value);



              // out
              if (destination) {
                destination.__source_values__.push(value);
              }
              // console.log(`${expr} (${id}) -- (${x}) -> ${destination ? `${destination.__expression__} (${destination.__id__})` : 'DONE'}`);
            })
          )
          .subscribe(observer);

        return () => sub.unsubscribe();
      });
    });
};


// (window as any).__instrument__ = (operator, fileName, expr, line, char) => {
//   return pipe(
//     operator,
//     (stream) => {
//       return Observable.create((observer) => {
//         const destination = getDestination(observer);
//         const id = ID++;
//         const location = `${fileName}:${line}:${char}`;
//         observer.__id__ = id;
//         observer.__location__ = location;
//         observer.__expression__ = expr;
//         observer.__values__ = [];
//         console.log('instrumenting operator: ', expr, observer);
//         addStreamByLocation(fileName, line, char, observer);
//         const sub = stream
//           .pipe(
//             tap((x) => {
//               // in
//               const value = {
//                 value: x,
//                 caused: [],
//               };
//
//               if (observer.__source_value__) {
//                 observer.__source_value__.caused.push(value);
//                 observer.__source_value__ = undefined;
//               }
//
//               observer.__values__.push(value);
//
//
//
//
//               // out
//               if (destination) {
//                 destination.__source_value__ = value;
//               }
//               // console.log(`${expr} (${id}) -- (${x}) -> ${destination ? `${destination.__expression__} (${destination.__id__})` : 'DONE'}`);
//             })
//           )
//           .subscribe(observer);
//
//         return () => sub.unsubscribe();
//       });
//     });
// };


// return (stream) => {
//   return Observable.create((observer) => {
//     const destination = getDestination(observer);
//     const id = ID++;
//     const location = `${fileName}:${line}:${char}`;
//     observer.__id__ = id;
//     observer.__location__ = location;
//     observer.__expression__ = expr;
//     observer.__values__ = [];
//     console.log('instrumenting operator: ', expr, observer);
//     const sub = stream
//       .pipe(
//         operator,
//         tap((x) => {
//           const value = {
//             value: x,
//           };
//           console.log(`${expr} (${id}) -- (${x}) -> ${destination ? `${destination.__expression__} (${destination.__id__})` : 'DONE'}`);
//         })
//       )
//       .subscribe(observer);
//
//     return () => sub.unsubscribe();
//   });
// };
