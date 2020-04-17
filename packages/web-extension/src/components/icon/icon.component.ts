import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';

export type IconSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'dr-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {

  private _icon = '';
  private _size: IconSize = 'medium';

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
    this.update();
  }

  @Input()
  get size(): IconSize {
    return this._size;
  }

  set size(value: IconSize) {
    this._size = value;
    this.update();
  }

  private update() {
    this.iconClass = `pi pi-${this._icon} ${this._size}`;
  }
}
