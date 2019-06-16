import {Component, Input} from '@angular/core';
import {StreamData} from '../../__instrument__/streams';

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.css']
})
export class TreeViewerComponent {

  @Input()
  streams: StreamData[];

  constructor() {
  }

}
