import {Directive, HostBinding, Input} from '@angular/core';
import {getX, getY} from './coords';
import {InstanceLink} from './types';
const POINT_OFFSET = 20;

@Directive({
  selector: 'path[appTreeViewerLink]'
})
export class TreeViewerLinkDirective {

  @Input()
  appTreeViewerLink: InstanceLink;

  @HostBinding('attr.data-source')
  get attrDataSource() {
    return this.appTreeViewerLink.source.instance.id;
  }

  @HostBinding('attr.data-target')
  get attrDataTarget() {
    return this.appTreeViewerLink.target.instance.id;
  }

  @HostBinding('attr.d')
  get attrD() {
    const sx = getX(this.appTreeViewerLink.source.x) + POINT_OFFSET;
    const sy = getY(this.appTreeViewerLink.source.y);
    const tx = getX(this.appTreeViewerLink.target.x) - POINT_OFFSET;
    const ty = getY(this.appTreeViewerLink.target.y);
    return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
  }

  @HostBinding('attr.opacity')
  get attrOpacity() {
    return this.appTreeViewerLink.source.properties.active && this.appTreeViewerLink.target.properties.active ? 1 : 0.1;
  }
}
