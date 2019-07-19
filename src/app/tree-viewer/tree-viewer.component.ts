import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Event, Instance} from '../state';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {changeDirection} from '../layout/tree';
import {DoubleTreeLayout, doubleTreeLayout} from '../layout/double-tree';
import {getHeight, getWidth} from './coords';

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewerComponent {
  private readonly observableSubject = new BehaviorSubject<Instance>(undefined);
  private readonly eventSubject = new BehaviorSubject<Event>(undefined);

  readonly layout$ = this.observableSubject.asObservable().pipe(
    map((observable) => doubleTreeLayout(
      observable,
      (node) => node.senders,
      node => node.receivers,
    )),
    map((layout) => changeDirection(layout, 'right')),
  );

  @Input('observable')
  set observableInput(observable: Instance) {
    this.observableSubject.next(observable);
  }

  @Input('event')
  set eventInput(event: Event) {
    this.eventSubject.next(event);
  }

  get observable() {
    return this.observableSubject.getValue();
  }

  getWidth(layout: DoubleTreeLayout<any>) {
    return getWidth(layout.width);
  }

  getHeight(layout: DoubleTreeLayout<any>) {
    return getHeight(layout.height);
  }
}
