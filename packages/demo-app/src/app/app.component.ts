import {Component, NgZone} from '@angular/core';
import * as examples from './examples';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  examples = Object.entries(examples).map(([name, run]) => ({name, run}));

  constructor(
    private readonly ngZone: NgZone,
  ) {
  }

  runNgZoneExample() {
    const o$ = new Observable((o) => {
      this.ngZone.runOutsideAngular(() => {
        o.next(1);
        o.next(2);
        setTimeout(() => {
          o.next(3);
          o.complete();
        });
      });
    }).pipe(
      (observable) =>
        new Observable((observer) =>
          this.ngZone.runOutsideAngular(() => {
            let sub;
            const id = setTimeout(() => {
              sub = observable.pipe(startWith(42)).subscribe(observer);
            }, 1000);
            return () => {
              if (sub) {
                sub.unsubscribe();
              } else {
                clearTimeout(id);
              }
            };
          }))
    );

    o$.subscribe();
  }
}
