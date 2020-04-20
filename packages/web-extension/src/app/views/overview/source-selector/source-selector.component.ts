import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {highlightAuto} from 'highlight.js';
import {sortBy} from 'ramda';


export interface Marker<T> {
  name: string;
  line: number;
  column: number;
  data: T;
}

interface Line {
  number: number;
  content: string;
  markers: Marker<unknown>[];
}

function getLines(content: string, markers: Marker<unknown>[]): Line[] {
  return content ?
    content.split(/\n/).map((lineContent, i) => {
      const line = i + 1;
      const lineMarkers = markers ? sortBy((marker) => marker.column, markers.filter((m) => m.line === line)) : [];
      return {number: line, markers: lineMarkers, content: lineContent};
    })
    : [];
}

@Component({
  selector: 'app-source-selector',
  templateUrl: './source-selector.component.html',
  styleUrls: ['./source-selector.component.scss']
})
export class SourceSelectorComponent implements OnInit, OnChanges {

  @Input()
  content: string | undefined;

  @Input()
  markers: Marker<unknown>[] = [];

  highlightedContent: string | undefined;
  lines: Line[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.content) {
      this.highlightedContent = this.content ? highlightAuto(this.content).value : '';
    }
    this.lines = getLines(this.highlightedContent, this.markers);
  }
}
