import {Component, Inject, OnInit} from '@angular/core';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';
import {DefaultLazyProperty} from './default-lazy-property';

@PropertyComponentClass()
@Component({
  selector: 'dr-default-lazy-property',
  template: `
      <ng-container *ngIf="!evaluated; else result">
          <dr-lazy (click)="evaluate()"></dr-lazy>
      </ng-container>
      <ng-template #result>
          <dr-property-outlet [data]="evaluationResult"></dr-property-outlet>
      </ng-template>
  `,
})
export class DefaultLazyPropertyComponent {

  static readonly TEST = (value) => value instanceof DefaultLazyProperty;

  evaluated = false;
  evaluationResult: any;

  constructor(
    @Inject(PROPERTY_VALUE) readonly lazy: DefaultLazyProperty,
  ) {
  }

  evaluate() {
    console.log(this.lazy);
    this.evaluationResult = this.lazy.target[this.lazy.property];
    this.evaluated = true;
  }
}
