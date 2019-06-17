import {Observable, pipe} from 'rxjs';
import {map, share, shareReplay, startWith, tap} from 'rxjs/operators';
import {data} from './data';
import {StreamData, trackStreamData} from './streams';
import {trackSubscribeEventData, trackUnsubscribeEventData, trackValueEventData} from './events';

function getDestination(observer: any) {
  return observer.__id__ !== undefined
    ? data.streams[observer.__id__]
    : observer.destination !== undefined
      ? getDestination(observer.destination)
      : trackStreamData('unknown', 'unknown', 0, 0, []);
}

function getSource(id) {
  return data.streams[id];
}

const instrumentOperator = (operator, file, expr, line, char) => {
  return pipe(
    operator,
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        console.log('instrumenting operator: ', expr);
        const destination: StreamData = getDestination(observer);
        const source: StreamData = trackStreamData(expr, file, line, char, [destination.id]);
        trackSubscribeEventData(source.id, destination.id);
        observer.__id__ = source.id;
        const sub = stream
          .pipe(
            tap((value) => {

                const valueEventData = trackValueEventData(value, source.id, destination.id);
                source.values.push(valueEventData.id);

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

const instrumentShareOperator = (operator, file, expr, line, char) => {
  let id: number | undefined;
  return pipe(
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        console.log('instrumenting share operator: ', expr);
        // const destination: StreamData = getDestination(observer);
        const source: StreamData = trackStreamData(expr, file, line, char, []);
        // trackSubscribeEventData(source.id, destination.id);
        observer.__id__ = source.id;
        id = source.id;
        const sub = stream.pipe(
          map((value) => ({value, sourceId: source.id})),
        ).subscribe(observer);

        return () => {
          sub.unsubscribe();
        };
      });
    },
    operator,
    (stream: Observable<any>) => {
      return Observable.create((observer) => {
        // console.log('instrumenting operator: ', expr);
        const destination: StreamData = getDestination(observer);
        // const source: StreamData = trackStreamData(expr, file, line, char, [destination.id]);
        // trackSubscribeEventData(source.id, destination.id);
        // observer.__id__ = source.id;
        // id = source.id;
        const sub = stream
          .pipe(
            map(({value, sourceId}) => {
                const source = getSource(sourceId);
                const valueEventData = trackValueEventData(value, sourceId, destination.id);
                source.values.push(valueEventData.id);
                if (!source.subscribers.includes(destination.id)) {
                  source.subscribers.push(destination.id);
                }
                return value;
              }
            )
          )
          .subscribe(observer);

        return () => {
          // trackUnsubscribeEventData(source.id, destination.id);
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

