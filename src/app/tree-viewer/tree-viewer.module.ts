import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeViewerComponent} from './tree-viewer.component';
import {OverlayModule} from '../overlay/overlay.module';

@NgModule({
  declarations: [TreeViewerComponent],
  exports: [
    TreeViewerComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ]
})
export class TreeViewerModule { }
