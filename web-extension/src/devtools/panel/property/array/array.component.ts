import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'dr-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayComponent {

  @Input()
  proto: string;

  @Input()
  length?: number;
}
