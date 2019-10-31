import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'dr-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectComponent {

  @Input()
  proto: string;
}
