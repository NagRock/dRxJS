import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'dr-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FunctionComponent {

  @Input()
  name: string;
}
