import {Observable, pipe} from 'rxjs';
import {tap} from 'rxjs/operators';
import {data} from './data';
import {StreamData, trackStreamData} from './streams';
import {trackSubscribeEventData, trackUnsubscribeEventData, trackValueEventData} from './events';

function getDestination(observer: any) {
  return observer.__id__ !== undefined
    ? data.streams[observer.__id__]
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : trackStreamData('unknown', 'unknown', 0, 0, -1);
}

const instrument = (operator, file, expr, line, char) => {
  return pipe(
    operator,
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        console.log('instrumenting operator: ', expr);
        const destination: StreamData = getDestination(observer);
        const source: StreamData = trackStreamData(expr, file, line, char, destination.id);
        trackSubscribeEventData(source.id, destination.id);
        observer.__id__ = source.id;
        const sub = stream
          .pipe(
            tap((x) => {

                const value = trackValueEventData(x, source.id, destination.id);
                source.values.push(value.id);

              }
            )
          )
          .subscribe(observer);

        return () => {
          trackUnsubscribeEventData(source.id, destination.id);
          sub.unsubscribe();
        };
      });
    });
};

export const enableInstrumentation = () => {
  (window as any).__instrument__ = instrument;
};

