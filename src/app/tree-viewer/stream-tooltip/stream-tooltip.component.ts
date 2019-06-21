import {Component, Input, OnInit} from '@angular/core';
import {StreamModel} from '../../model';

@Component({
  selector: 'app-stream-tooltip',
  templateUrl: './stream-tooltip.component.html',
  styleUrls: ['./stream-tooltip.component.css']
})
export class StreamTooltipComponent implements OnInit {

  @Input()
  data: StreamModel;

  constructor() { }

  ngOnInit() {
  }

}
