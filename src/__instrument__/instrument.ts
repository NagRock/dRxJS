import {Observable, pipe} from 'rxjs';
import {share, shareReplay, tap} from 'rxjs/operators';
import {data} from './data';
import {StreamData, trackStreamData} from './streams';
import {trackSubscribeEventData, trackUnsubscribe, trackValueEventData} from './events';

function getDestination(observer: any) {
  return observer.__id__ !== undefined
    ? data.streams[observer.__id__]
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : trackStreamData('unknown', 'unknown', 0, 0);
}

function getSource(id) {
  return data.streams[id];
}

const instrumentOperator = (operator, file, expr, line, char) => {
  return pipe(
    operator,
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        const destination: StreamData = getDestination(observer);
        const source: StreamData = trackStreamData(expr, file, line, char);
        trackSubscribeEventData(source, destination);
        observer.__id__ = source.id;
        const sub = stream
          .pipe(
            tap((value) => {
                trackValueEventData(value, source, destination);
              }
            )
          )
          .subscribe(observer);

        return () => {
          trackUnsubscribe(source, destination);
          sub.unsubscribe();
        };
      });
    });
};

const instrumentShareOperator = (operator, file, expr, line, char) => {
  return (sharedStream) => sharedStream.pipe(
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        observer.__id__ = sharedStream.__id__;
        const sub = stream.subscribe(observer);

        return () => {
          sub.unsubscribe();
        };
      });
    },
    operator,
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        let source: StreamData;
        if (sharedStream.__id__ === undefined) {
          console.log('instrumenting share operator: ', expr);
          source = trackStreamData(expr, file, line, char);
          sharedStream.__id__ = source.id;
        } else {
          source = getSource(sharedStream.__id__);
        }
        const destination: StreamData = getDestination(observer);
        trackSubscribeEventData(source, destination);
        const sub = stream
          .pipe(
            tap((value) => {
                trackValueEventData(value, source, destination);
              }
            )
          )
          .subscribe(observer);

        return () => {
          trackUnsubscribe(source, destination);
          sub.unsubscribe();
        };
      });
    });
};


const instrumentOperatorCall = (operator, args, file, expr, line, char) => {
  switch (operator) {
    case share:
    case shareReplay:
      return instrumentShareOperator(operator.apply(undefined, args), file, expr, line, char);
    default:
      return instrumentOperator(operator.apply(undefined, args), file, expr, line, char);
  }
};

export const enableInstrumentation = () => {
  (window as any).__instrument__ = {
    operator: instrumentOperator,
    operatorCall: instrumentOperatorCall,
  };
};

