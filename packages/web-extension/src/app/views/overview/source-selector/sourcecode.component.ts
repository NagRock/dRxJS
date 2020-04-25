import {Component, ContentChild, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {highlightAuto} from 'highlight.js';
import {sortBy} from 'ramda';
import {SourcecodeMarker} from './sourcecode-marker';
import {SourcecodeMarkerDetailsDirective} from './sourcecode-marker-details.directive';


interface Line {
  number: number;
  content: string;
  markers: SourcecodeMarker[];
}

function getLines(content: string, markers: SourcecodeMarker[]): Line[] {
  return content ?
    content.split(/\n/).map((lineContent, i) => {
      const line = i + 1;
      const lineMarkers = markers ? sortBy((marker) => marker.column, markers.filter((m) => m.line === line)) : [];
      return {number: line, markers: lineMarkers, content: lineContent};
    })
    : [];
}

@Component({
  selector: 'dr-sourcecode',
  templateUrl: './sourcecode.component.html',
  styleUrls: ['./sourcecode.component.scss']
})
export class SourcecodeComponent implements OnInit, OnChanges {

  @Input()
  content: string | undefined;

  @Input()
  markers: SourcecodeMarker[] = [];

  @ContentChild(SourcecodeMarkerDetailsDirective, {static: false})
  markerDetails: SourcecodeMarkerDetailsDirective;

  highlightedContent: string | undefined;
  lines: Line[] = [];

  readonly expandedMarkers = new Set<string>();

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

  toggleMarker(marker: SourcecodeMarker) {
    const key = this.getMarkerKey(marker);
    if (this.expandedMarkers.has(key)) {
      this.expandedMarkers.delete(key);
    } else {
      this.expandedMarkers.add(key);
    }
  }

  isMarkerExpanded(marker: SourcecodeMarker) {
    return this.expandedMarkers.has(this.getMarkerKey(marker));
  }

  getMarkerKey(marker: SourcecodeMarker) {
    return `${marker.line}:${marker.column}`;
  }
}
