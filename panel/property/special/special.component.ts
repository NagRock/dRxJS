import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'dr-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialComponent {

  @Input()
  value: string;

  @Input()
  prefix?: string;

  @Input()
  suffix?: string;
}
