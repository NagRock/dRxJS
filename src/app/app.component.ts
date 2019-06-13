import {Component} from '@angular/core';
import {SampleService} from './sample.service';
import {debounceTime, delay, filter, map, throttleTime} from 'rxjs/operators';

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
      throttleTime(1000),
      filter((x) => x > window.innerWidth / 2),
      /*s2 ->*/ map(pos => pos) /*-> s3*/,
    ).subscribe(x => console.log(x));
  }
}
