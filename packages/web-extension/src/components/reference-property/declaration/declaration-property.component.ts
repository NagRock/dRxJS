import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DeclarationReference} from '@doctor-rxjs/events';
import {Observable} from 'rxjs';
import {Declaration} from '../../../app/model/model';
import {ModelService} from '../../../app/services/model.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-declaration-property',
  templateUrl: './declaration-property.component.html',
  styleUrls: ['./declaration-property.component.scss']
})
export class DeclarationPropertyComponent implements OnChanges {

  @Input()
  name: string;

  @Input()
  enumerable: boolean;

  @Input()
  reference: DeclarationReference;

  declaration$: Observable<Declaration>;

  constructor(private readonly modelService: ModelService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reference) {
      this.declaration$ = this.modelService.model$.pipe(map((model) => {
        return model.declarations[this.reference.id];
      }));
    }
  }

  getLongLocation(declaration: Declaration) {
    const {file, line, column} = declaration.position;
    return `${file}:${line}:${column}`;
  }

  getShortLocation(declaration: Declaration) {
    const {file, line} = declaration.position;
    return `${file.substring(file.lastIndexOf('/') + 1)}:${line}`;
  }

  openLocation(declaration: Declaration) {
    // const {file, line} = declaration.position;
    // this.resources.open(file, line); todo: fix
  }
}
