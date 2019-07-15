import {Directive, HostBinding, Input} from '@angular/core';
import {Node} from '../layout/tree';
import {Instance} from '../state';
import {getX, getY} from './coords';

@Directive({
  selector: '[appTreeViewerNode]'
})
export class TreeViewerNodeDirective {

  @Input()
  appTreeViewerNode: Node<Instance | Instance>;

  @HostBinding('attr.data-node')
  get attrDataNode() {
    return this.appTreeViewerNode.data.id;
  }

  @HostBinding('attr.transform')
  get attrTransform() {
    const x = getX(this.appTreeViewerNode.x);
    const y = getY(this.appTreeViewerNode.y);
    return `translate(${x},${y})`;
  }

}
