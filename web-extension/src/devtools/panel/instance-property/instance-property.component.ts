import {ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef} from '@angular/core';
import {Instance} from '../state';

@Component({
  selector: 'dr-instance-property',
  templateUrl: './instance-property.component.html',
  styleUrls: ['./instance-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstancePropertyComponent {

  @Input()
  key: string;

  @Input()
  instance: Instance;

  get suffix() {
    return ` #${this.instance.id}`;
  }
}
