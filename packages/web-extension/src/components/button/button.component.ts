import {ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, OnInit, ViewEncapsulation} from '@angular/core';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonDisplay = 'inline' | 'block';
export type ButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'button[dr-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnChanges {


  @Input()
  size: ButtonSize = 'medium';

  @Input()
  display: ButtonDisplay = 'block';

  @Input()
  variant: ButtonVariant = 'primary';

  @Input()
  class: string;

  @HostBinding('class')
  classList: string;

  ngOnChanges(): void {
    this.classList = `${this.class} ${this.size} ${this.display} ${this.variant}`;
  }

}
