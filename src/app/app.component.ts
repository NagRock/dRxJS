import {Component} from '@angular/core';
import {SampleService} from './sample.service';
import {debounceTime, delay, expand, filter, map, switchMap, tap, throttleTime} from 'rxjs/operators';
import {EMPTY, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-ts-transformer';

  constructor(private sample: SampleService) {
    const observable = this.sample.mousePos$.pipe(
      /*s1 ->*/ map(pos => pos.x) /*-> s2*/,
      throttleTime(1000),

      // switchMap((x) => of('a', 'b').pipe(map((y) => `${y}: ${x}`))),

      filter((x) => x > window.innerWidth / 2),

      // expand((x) =>
      //   typeof (x) === 'number'
      //     ? of('a', 'b').pipe(map((s) => `${s}: ${x}`))
      //     : EMPTY),

      /*s2 ->*/ map(pos => pos) /*-> s3*/,
    );
    observable.subscribe(x => console.log(x));
    observable.subscribe(x => console.log(x));
  }
}
