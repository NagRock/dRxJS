import {Component, Input, OnInit} from '@angular/core';
import {StreamData} from '../../../__instrument__/streams';

@Component({
  selector: 'app-stream-tooltip',
  templateUrl: './stream-tooltip.component.html',
  styleUrls: ['./stream-tooltip.component.css']
})
export class StreamTooltipComponent implements OnInit {

  @Input()
  data: StreamData;

  constructor() { }

  ngOnInit() {
  }

}
