import {Component} from '@angular/core';
import {map, shareReplay, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {data as DATA} from '../__instrument__/data';
import {MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {EventModel, getModel, Model, StreamModel} from './model';
import anime from 'animejs';
import {getEvents} from './events';


const getStreamsByLocation = (streams: StreamModel[]) => {
  const groups = streams.reduce((streamsByFile, stream) => {
    const location = `${stream.location.file} (${stream.location.line}:${stream.location.char})`;
    const group = streamsByFile[location] || (streamsByFile[location] = []);
    group.push(stream);
    return streamsByFile;
  }, {});
  return Object.entries(groups).map(([location, instances]) => ({location, instances}));
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  treeControl = new NestedTreeControl<any>(node => node.instances);
  dataSource = new MatTreeNestedDataSource<any>();
  model: Model;
  stream: StreamModel;
  events: EventModel[];
  event: EventModel;

  constructor() {
    // this.runSimpleExampleWithPrimitives();
    this.runSimpleExample();
    // this.runMousePositionExample();
  }

  setStream(stream: StreamModel) {
    this.stream = stream;
    this.events = getEvents(stream);
  }

  hasChild = (_: number, node: any) => !!node.instances && node.instances.length > 0;

  refresh(id?: number) {
    this.model = getModel(DATA);
    this.dataSource.data = getStreamsByLocation(this.model.streams);

    if (id !== undefined) {
      this.setStream(this.model.streams[id]);
    }
  }

  private runSimpleExample() {
    const stream$ = of('a', 'b', 'c', 'd')
      .pipe(
        map((zeroMap) => `${zeroMap}:${zeroMap}`),
        map((firstMap) => `${firstMap}:${firstMap}`),
        tap(() => console.trace()),
        // delay(1000),
        shareReplay(1),
        map((lastMap) => `${lastMap}:${lastMap}`),
      );

    stream$.subscribe(((x) => console.log('result:', x)));
    stream$.subscribe(((x) => console.log('result:', x)));
  }

  private runSimpleExampleWithPrimitives() {
    const stream$ = of('a', 'a', 'a', 'b', 'a', 'c', 'd')
      .pipe(
        map((FIRST) => FIRST),
        map((LAST) => LAST),
      );

    stream$.subscribe(((x) => console.log('result:', x)));
  }
}
