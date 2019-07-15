import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {isReceiver, isSender, ObservableInstance, Receiver, Sender} from '../state';
import {BehaviorSubject, Subject} from 'rxjs';
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
  private readonly observableSubject = new BehaviorSubject<Sender | Receiver>(undefined);

  readonly layout$ = this.observableSubject.asObservable().pipe(
    map((observable) => doubleTreeLayout(
      observable,
      (node) => isReceiver(node) ? node.senders : [],
      node => isSender(node) ? node.receivers : [],
    )),
    map((layout) => changeDirection(layout, 'right')),
  );

  @Input('observable')
  set observableInput(observable: ObservableInstance) {
    this.observableSubject.next(observable);
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
