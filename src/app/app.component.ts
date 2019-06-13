import {Component} from '@angular/core';
import {SampleService} from './sample.service';
import {map, tap} from 'rxjs/operators';
import {filter} from 'minimatch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-ts-transformer';

  constructor(private sample: SampleService) {
    this.sample.mousePos$.pipe(
      map(pos => pos.x),
    ).subscribe(x => console.log(x));
  }
}


