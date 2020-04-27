import {ChangeDetectionStrategy, Component, Inject, OnChanges, SimpleChanges} from '@angular/core';
import {ObservableReference} from '@doctor-rxjs/events';
import {ModelService} from '../../../app/services/model.service';
import {Observable} from 'rxjs';
import {Observable as ObservableModel} from '../../../app/model/model';
import {map} from 'rxjs/operators';
import {PROPERTY_VALUE} from '../../property';

@Component({
  selector: 'dr-observable-reference-property',
  templateUrl: './observable-reference-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableReferencePropertyComponent implements OnChanges {

  observable$: Observable<ObservableModel>;

  constructor(
    @Inject(PROPERTY_VALUE) readonly reference: ObservableReference,
    private readonly modelService: ModelService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reference) {
      this.observable$ = this.modelService.model$.pipe(map((model) => {
        return model.observables[this.reference.id];
      }));
    }
  }
}
