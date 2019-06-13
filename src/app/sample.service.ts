import {Injectable} from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  private subj = new Subject<{ x: number, y: number }>();

  constructor() {
    fromEvent<MouseEvent>(window, 'mousemove').subscribe(
      e => this.subj.next({x: e.clientX, y: e.clientY}),
    );
  }

  get mousePos$(): Observable<{ x: number, y: number }> {
    return this.subj.asObservable();
  }
}
