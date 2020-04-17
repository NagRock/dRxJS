import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'dr-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent<T> implements OnInit {

  @Input()
  selected: T;

  @Output()
  readonly selectedChange = new EventEmitter<T>();

  constructor() {
  }

  ngOnInit() {
  }

  setTab(value: T): void {
    this.selected = value;
    this.selectedChange.emit(value);
  }

  addTab(value: T): Observable<T> {
    if (this.selected === undefined) {
      this.setTab(value);
    }
    return this.selectedChange.pipe(startWith(this.selected));
  }
}
