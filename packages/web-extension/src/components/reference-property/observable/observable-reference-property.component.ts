import {ChangeDetectionStrategy, Component, Inject, OnChanges, SimpleChanges} from '@angular/core';
import {ModelService} from '../../../app/services/model.service';
import {Observable} from 'rxjs';
import {Observable as ObservableModel, ObservableRef} from '../../../app/model/model';
import {map, tap} from 'rxjs/operators';
import {PROPERTY_VALUE, PropertyComponentClass} from '../../property';

@PropertyComponentClass()
@Component({
  selector: 'dr-observable-reference-property',
  templateUrl: './observable-reference-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableReferencePropertyComponent {

  static readonly TEST = (value) => value instanceof ObservableRef;

  readonly observable$: Observable<ObservableModel>;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: ObservableRef,
    private readonly modelService: ModelService,
  ) {
    this.observable$ = this.modelService.model$.pipe(
      map((model) => model.observables[this.reference.id]),
      tap((x) => console.log('observable', x)),
    );
  }
}
