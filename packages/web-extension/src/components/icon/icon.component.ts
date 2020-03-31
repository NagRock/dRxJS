import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'dr-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {

  private _icon: string;

  @HostBinding('class')
  iconClass = 'pi';

  @Input()
  @HostBinding('class.pi-spin')
  spin: string;

  @Input()
  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
    this.iconClass = `pi pi-${value}`;
  }

}
