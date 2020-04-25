import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ObservableReference} from '@doctor-rxjs/events';
import {ModelService} from '../../../app/services/model.service';
import {Observable} from 'rxjs';
import {Observable as ObservableModel} from '../../../app/model/model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'dr-observable-reference-property',
  templateUrl: './observable-reference-property.component.html',
  styleUrls: ['./observable-reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableReferencePropertyComponent implements OnChanges {

  @Input()
  name: string;

  @Input()
  enumerable: boolean;

  @Input()
  reference: ObservableReference;

  observable$: Observable<ObservableModel>;

  constructor(private readonly modelService: ModelService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reference) {
      this.observable$ = this.modelService.model$.pipe(map((model) => {
        return model.observables[this.reference.id];
      }));
    }
  }

  getLongLocation(definition: Definition) {
    const {file, line, column} = definition.position;
    return `${file}:${line}:${column}`;
  }

  getShortLocation(definition: Definition) {
    const {file, line} = definition.position;
    return `${file.substring(file.lastIndexOf('/') + 1)}:${line}`;
  }

  openLocation(definition: Definition) {
    // const {file, line} = definition.position;
    // this.resources.open(file, line); todo: fix
  }
}
