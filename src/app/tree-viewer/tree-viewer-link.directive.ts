import {Directive, HostBinding, Input} from '@angular/core';
import {Link} from '../layout/tree';
import {getX, getY} from './coords';
import {Instance} from '../state';

@Directive({
  selector: 'path[appTreeViewerLink]'
})
export class TreeViewerLinkDirective {

  @Input()
  appTreeViewerLink: Link<Instance | Instance>;

  @HostBinding('attr.data-source')
  get attrDataSource() {
    return this.appTreeViewerLink.source.data.id;
  }

  @HostBinding('attr.data-target')
  get attrDataTarget() {
    return this.appTreeViewerLink.target.data.id;
  }

  @HostBinding('attr.d')
  get attrD() {
    const sx = getX(this.appTreeViewerLink.source.x);
    const sy = getY(this.appTreeViewerLink.source.y);
    const tx = getX(this.appTreeViewerLink.target.x);
    const ty = getY(this.appTreeViewerLink.target.y);
    return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
  }
}
