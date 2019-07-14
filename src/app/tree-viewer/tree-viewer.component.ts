import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {isReceiver, isSender, ObservableInstance, Receiver, Sender} from '../state';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Node, Link} from '../layout/tree';
import {DoubleTreeLayout, doubleTreeLayout} from '../layout/double-tree';

const space = 240;

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewerComponent {
  private readonly observableSubject = new Subject<Sender | Receiver>();

  readonly layout$ = this.observableSubject.asObservable().pipe(
    map((observable) => doubleTreeLayout(
      observable,
      (node) => isReceiver(node) ? node.senders : [],
      node => isSender(node) ? node.receivers : [],
    )),
  );

  @Input()
  set observable(observable: ObservableInstance) {
    this.observableSubject.next(observable);
  }

  getWidth(layout: DoubleTreeLayout<any>) {
    return (layout.width + 1) * space;
  }

  getHeight(layout: DoubleTreeLayout<any>) {
    return (layout.height + 1) * space;
  }

  getNodeTransform(node: Node<any>) {
    const x = (node.x + 0.5) * space;
    const y = (node.y + 0.5) * space;
    return `translate(${x},${y})`;
  }
}
