import {Component} from '@angular/core';
import {SampleService} from './sample.service';
import {delay, distinctUntilChanged, filter, map, shareReplay, throttleTime} from 'rxjs/operators';
import {of} from 'rxjs';
import {StreamData} from '../__instrument__/streams';
import {data as DATA} from '../__instrument__/data';

const mapValues = <V0, V1>(object: { [key: string]: V0 }, mapper: (streams: V0) => V1) => {
  return Object.entries(object)
    .map(([k, v]) => [k, mapper(v)])
    .reduce(((o, [k, v]: [string, V1]) => {
      o[k] = v;
      return o;
    }), {});
};

const getStreamsByChar = (streams: StreamData[]) => {
  return streams.reduce((streamsByChar, stream) => {
    const group = streamsByChar[stream.location.file] || (streamsByChar[stream.location.file] = []);
    group.push(stream);
    return streamsByChar;
  }, {});
};

const getStreamsByLineChar = (streams: StreamData[]) => {
  const groups = streams.reduce((streamsByLine, stream) => {
    const group = streamsByLine[stream.location.file] || (streamsByLine[stream.location.file] = []);
    group.push(stream);
    return streamsByLine;
  }, {});
  return mapValues(groups, getStreamsByChar);
};

const getStreamsByFileLineChar = (streams: StreamData[]) => {
  const groups = streams.reduce((streamsByFile, stream) => {
    const group = streamsByFile[stream.location.file] || (streamsByFile[stream.location.file] = []);
    group.push(stream);
    return streamsByFile;
  }, {});
  return mapValues(groups, getStreamsByLineChar);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  data = DATA;
  streams = getStreamsByFileLineChar(DATA.streams);

  constructor(private sample: SampleService) {
    this.runSimpleExampleWithPrimitives();
    // this.runSimpleExample();
    // this.runMousePositionExample();
  }

  refresh() {
    this.data = DATA;
    this.streams = getStreamsByFileLineChar(DATA.streams);
  }

  private runSimpleExample() {
    const stream$ = of('a', 'b', 'c', 'd')
      .pipe(
        map((firstMap) => `${firstMap}:${firstMap}`),
        delay(1000),
        map((lastMap) => `${lastMap}:${lastMap}`),
        shareReplay(1),
      );

    stream$.subscribe(((x) => console.log('result:', x)));
    stream$.subscribe(((x) => console.log('result:', x)));
  }

  private runSimpleExampleWithPrimitives() {
    const stream$ = of('a', 'a', 'a', 'b', 'a', 'c', 'd')
      .pipe(
        distinctUntilChanged(),
        map((x) => new String(x)),
      );

    stream$.subscribe(((x) => console.log('result:', x)));
  }

  private runMousePositionExample() {
    const observable = this.sample.mousePos$.pipe(
      /*s1 ->*/ map(firstMap => firstMap.x) /*-> s2*/,
      throttleTime(1000),

      // tap(x => console.log('tap:', x)),
      // switchMap((x) => of('a', 'b').pipe(map((y) => `${y}: ${x}`))),

      filter((x) => x > window.innerWidth / 2),

      // expand((x) =>
      //   typeof (x) === 'number'
      //     ? of('a', 'b').pipe(map((s) => `${s}: ${x}`))
      //     : EMPTY),

      /*s2 ->*/ map(lastMap => lastMap) /*-> s3*/,
      // shareReplay(1),
    );
    observable.subscribe(x => console.log(x));
    // observable.subscribe(x => console.log(x));
    // observable.subscribe(x => console.log(x));
    // observable.subscribe(x => console.log(x));
  }
}
