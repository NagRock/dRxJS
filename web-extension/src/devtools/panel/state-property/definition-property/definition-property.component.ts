import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Definition} from '../../state';
import {browser} from '../../../../types/webextension-polyfill-ts';

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
    // @ts-ignore
    browser.devtools.panels.openResource(file/*.replace('webpack:///', 'webpack:///./')*/, line - 1);
  }
}
