import {Component, Inject} from '@angular/core';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {SourceFilePosition} from '../../../app/model';

function getShort(position: SourceFilePosition) {
  const segments = position.file.split('/');
  return `${segments[segments.length - 1]}:${position.line}`;
}

function getLong(position: SourceFilePosition) {
  return `${position.file}:${position.line}:${position.column}`;
}

@PropertyComponentClass()
@Component({
  selector: 'dr-source-file-position-property',
  templateUrl: './source-file-position-property.component.html',
  styleUrls: ['./source-file-position-property.component.scss'],
})
export class SourceFilePositionPropertyComponent {

  static readonly TEST = (value) => value instanceof SourceFilePosition;

  short: string;
  long: string;

  constructor(
    @Inject(PROPERTY_VALUE) private readonly position: SourceFilePosition,
  ) {
    this.short = getShort(position);
    this.long = getLong(position);
  }
}
