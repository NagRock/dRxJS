import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeViewerComponent} from './tree-viewer.component';
import {StreamTooltipModule} from './stream-tooltip/stream-tooltip.module';

@NgModule({
  declarations: [TreeViewerComponent],
  exports: [
    TreeViewerComponent
  ],
  imports: [
    CommonModule,
    StreamTooltipModule
  ]
})
export class TreeViewerModule { }
