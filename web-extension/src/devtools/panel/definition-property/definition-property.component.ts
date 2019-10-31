import {ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef} from '@angular/core';
import {Definition} from '../state';

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

}
