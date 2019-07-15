import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {isReceiver, isSender, ObservableInstance, Receiver, Sender} from '../state';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Node, Link, changeDirection} from '../layout/tree';
import {DoubleTreeLayout, doubleTreeLayout} from '../layout/double-tree';

const distanceBetweenNodes = 320;
const distanceBetweenNodeAndEdge = distanceBetweenNodes / 2;

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
    map((layout) => changeDirection(layout, 'right')),
  );

  @Input()
  set observable(observable: ObservableInstance) {
    this.observableSubject.next(observable);
  }

  getWidth(layout: DoubleTreeLayout<any>) {
    return 2 * distanceBetweenNodeAndEdge + Math.max(layout.width - 1, 0) * distanceBetweenNodes;
  }

  getHeight(layout: DoubleTreeLayout<any>) {
    return 2 * distanceBetweenNodeAndEdge + Math.max(layout.height - 1, 0) * distanceBetweenNodes;
  }

  getNodeTransform(node: Node<any>) {
    const x = distanceBetweenNodeAndEdge + node.x * distanceBetweenNodes;
    const y = distanceBetweenNodeAndEdge + node.y * distanceBetweenNodes;
    return `translate(${x},${y})`;
  }
}
