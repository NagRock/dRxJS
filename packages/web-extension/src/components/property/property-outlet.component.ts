import {ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PropertyComponentType} from './property-component-type';
import {PropertyComponentsRegistry} from './property-components.registry';
import {DATA} from './property.component';

@Component({
  selector: 'dr-property-outlet',
  template: `
      <ng-container *ngComponentOutlet="component; injector: componentInjector"></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyOutletComponent implements OnChanges {

  @Input()
  type: string;

  @Input()
  data: any;

  component: PropertyComponentType;
  componentInjector: Injector;

  constructor(
    private readonly injector: Injector,
    private readonly registry: PropertyComponentsRegistry,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type) {
      this.component = this.registry.get(this.type);
    }
    if (changes.data) {
      this.componentInjector = Injector.create({
        parent: this.injector,
        providers: [
          {provide: DATA, useValue: this.data},
        ],
      });
    }
  }
}
