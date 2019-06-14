import {Component} from '@angular/core';
import {SampleService} from './sample.service';
import {filter, map, mapTo, switchMap, throttleTime} from 'rxjs/operators';
import {of, timer} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-ts-transformer';

  constructor(private sample: SampleService) {
    this.sample.mousePos$.pipe(
      /*s1 ->*/ map(pos => pos.x) /*-> s2*/,
      // throttleTime(1000),
      switchMap((x) => timer(Math.random() * 3000).pipe(
        mapTo(x),
      )),
      filter((x) => x > window.innerWidth / 2),
      /*s2 ->*/ map(pos => pos) /*-> s3*/,
    ).subscribe(x => console.log('RESULT:', x));
  }
}
