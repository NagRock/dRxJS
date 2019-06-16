import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewerComponent } from './tree-viewer.component';

@NgModule({
  declarations: [TreeViewerComponent],
  exports: [
    TreeViewerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TreeViewerModule { }
