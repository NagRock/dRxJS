import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ModelService} from '../../services/model.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {Definition, Model} from '../../model/model';

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
  private content$ = new Observable<chrome.devtools.inspectedWindow.Resource[]>(
    (observer) => chrome.devtools.inspectedWindow.getResources((resources) => {
      observer.next(resources);
      chrome.devtools.inspectedWindow.onResourceAdded.addListener((r) => observer.next([r]));
    })).pipe(
    tap(console.log),
    map((resources) => {
      return resources.find((resource) => resource.url === 'webpack:///./src/app/examples.ts');
    }),
    filter(Boolean),
    switchMap((resource: chrome.devtools.inspectedWindow.Resource) => new Observable(o => resource.getContent((content) => {
      o.next(content);
      o.complete();
    })))
  );

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

  constructor(
    private readonly modelService: ModelService,
  ) {
  }
}
