import {ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PropertyComponentClassType} from './property-component-class';
import {PropertyComponentsRegistry} from './property-components.registry';
import {PROPERTY_VALUE} from './property.component';

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

  component: PropertyComponentClassType;
  componentInjector: Injector;

  constructor(
    private readonly injector: Injector,
    private readonly registry: PropertyComponentsRegistry,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.component = this.registry.get(this.data);
      this.componentInjector = Injector.create({
        parent: this.injector,
        providers: [
          {provide: PROPERTY_VALUE, useValue: this.data},
        ],
      });
    }
  }
}
