import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'dr-lazy',
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyComponent {

  @Output()
  readonly click = new EventEmitter<void>();
}
