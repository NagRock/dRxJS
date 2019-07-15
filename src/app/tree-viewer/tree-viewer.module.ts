import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeViewerComponent} from './tree-viewer.component';
import {OverlayModule} from '../overlay/overlay.module';
import { TreeViewerNodeDirective } from './tree-viewer-node.directive';
import { TreeViewerLinkDirective } from './tree-viewer-link.directive';

@NgModule({
  declarations: [TreeViewerComponent, TreeViewerNodeDirective, TreeViewerLinkDirective],
  exports: [
    TreeViewerComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ]
})
export class TreeViewerModule { }
