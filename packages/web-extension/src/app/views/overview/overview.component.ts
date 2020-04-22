import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ModelService} from '../../services/model.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {Definition, Model} from '../../model/model';
import {ResourcesService} from '../../services/resources.service';
import {SourcecodeMarker} from './source-selector/sourcecode-marker';

interface SourceSearch {
  kind: 'source';
  url: string;
}

interface ElementSearch {
  kind: 'element';
  element: number;
}

type Search
  = SourceSearch
  | ElementSearch;

function filterModel(model: Model, search: string) {
  return {
    definitions: model.definitions.filter((d: Definition) => d.name.includes(search) || d.position.file.includes(search) || d.position.functionName.includes(search)),
  };
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {

  private readonly searchSubject = new BehaviorSubject<string | undefined>(undefined);
  content$ = this.resourcesService.getContent('webpack:///./src/app/examples.ts');
  markers$ = this.modelService.model$
    .pipe(map((model) => {
      const markers: SourcecodeMarker<Definition[]>[] = [];
      model.definitions.forEach((definition) => {
        if (definition.position.file.endsWith('examples.ts')) {
          const marker = markers.find((m) => m.line === definition.position.line && m.column === definition.position.column);
          if (marker) {
            marker.data.push(definition);
          } else {
            const newMarker = {name: definition.name, line: definition.position.line, column: definition.position.column, data: [definition]};
            markers.push(newMarker);
          }

        }
      });
      return markers;
    }));

  readonly context$ = combineLatest([
    this.searchSubject,
    this.modelService.model$,
  ]).pipe(map(([search, model]) => ({
    stats: {
      definitions: model.definitions.length,
      instances: model.instances.length,
      events: model.events.length,
      tasks: model.tasks.length,
    }
  })));
  searches = ['examples.ts', 'main.ts', 'asd.ts'];
  selected = 'new';

  res$ = this.resourcesService.resources$;
  files$ = this.modelService.model$.pipe(map(x => {
    console.log(x);
    return x.definitions.map((d => d.position.file));
  }));

  constructor(
    private readonly modelService: ModelService,
    private readonly resourcesService: ResourcesService,
  ) {
    // this.modelService.model$.subscribe(model => console.log({model}));
  }
}
