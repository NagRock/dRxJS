import {Component} from '@angular/core';
import {SampleService} from './sample.service';
import {debounceTime, delay, expand, filter, map, shareReplay, switchMap, tap, throttleTime} from 'rxjs/operators';
import {EMPTY, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-ts-transformer';

  constructor(private sample: SampleService) {
    this.runSimpleExample();
    // this.runMousePositionExample();
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
