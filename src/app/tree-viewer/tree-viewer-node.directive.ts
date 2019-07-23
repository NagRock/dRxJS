import {Directive, HostBinding, Input} from '@angular/core';
import {getX, getY} from './coords';
import {InstanceNode} from './types';

@Directive({
  selector: '[appTreeViewerNode]'
})
export class TreeViewerNodeDirective {

  @Input()
  appTreeViewerNode: InstanceNode;

  @HostBinding('attr.data-node')
  get attrDataNode() {
    return this.appTreeViewerNode.instance.id;
  }

  @HostBinding('attr.transform')
  get attrTransform() {
    const x = getX(this.appTreeViewerNode.x);
    const y = getY(this.appTreeViewerNode.y);
    return `translate(${x},${y})`;
  }

  @HostBinding('attr.opacity')
  get attrOpacity() {
    return this.appTreeViewerNode.properties && this.appTreeViewerNode.properties.subscribed ? '1' : '0.1';
  }
}
