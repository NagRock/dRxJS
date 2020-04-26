import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ModelService} from '../../services/model.service';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ResourcesService} from '../../services/resources.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {

  // private readonly searchSubject = new BehaviorSubject<string | undefined>(undefined);
  content$ = this.resourcesService.getContent('webpack:///./src/app/examples.ts');
  markers$ = this.modelService.model$
    .pipe(map((model) => {
      const file = model.files['webpack:///src/app/examples.ts'];
      return file ? file.markers : [];
    }));

  // readonly context$ = combineLatest([
  //   this.searchSubject,
  //   this.modelService.model$,
  // ]).pipe(map(([search, model]) => ({
  //   stats: {
  //     observables: model.observables.length,
  //     instances: model.instances.length,
  //     events: model.events.length,
  //     tasks: model.tasks.length,
  //   }
  // })));

  searches = ['examples.ts', 'main.ts', 'asd.ts'];
  selected = 'new';

  // res$ = this.resourcesService.resources$;
  // files$ = this.modelService.model$.pipe(map(x => {
  //   console.log(x);
  //   return x.definitions.map((d => d.position.file));
  // }));

  constructor(
    private readonly modelService: ModelService,
    private readonly resourcesService: ResourcesService,
  ) {
    // this.modelService.model$.subscribe(model => console.log({model}));
  }
}
