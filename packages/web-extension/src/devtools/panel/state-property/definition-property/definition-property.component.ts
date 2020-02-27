import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Definition} from '../../state';
import {browser} from '../../../../types/webextension-polyfill-ts';
import {ResourcesService} from '../../resources';

@Component({
  selector: 'dr-definition-property',
  templateUrl: './definition-property.component.html',
  styleUrls: ['./definition-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionPropertyComponent {

  @Input()
  key: string;

  @Input()
  definition: Definition;

  constructor(
    private readonly resources: ResourcesService,
  ) {
  }


  get suffix() {
    return ` #${this.definition.id}`;
  }

  get longLocation() {
    const {file, line, column} = this.definition.position;
    return `${file}:${line}:${column}`;
  }

  get shortLocation() {
    const {file, line} = this.definition.position;
    return `${file.substring(file.lastIndexOf('/') + 1)}:${line}`;
  }

  openLocation() {
    const {file, line} = this.definition.position;
    this.resources.open(file, line);
  }
}
