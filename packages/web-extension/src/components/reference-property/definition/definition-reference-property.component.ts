import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DefinitionReference} from '@doctor-rxjs/events';
import {ModelService} from '../../../app/services/model.service';
import {Observable} from 'rxjs';
import {Definition} from '../../../app/model/model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'dr-definition-reference-property',
  templateUrl: './definition-reference-property.component.html',
  styleUrls: ['./definition-reference-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefinitionReferencePropertyComponent implements OnChanges {

  @Input()
  name: string;

  @Input()
  enumerable: boolean;

  @Input()
  reference: DefinitionReference;

  definition$: Observable<Definition>;

  constructor(private readonly modelService: ModelService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reference) {
      this.definition$ = this.modelService.model$.pipe(map((model) => {
        console.log({model, id: this.reference.id});
        return model.definitions[this.reference.id];
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
