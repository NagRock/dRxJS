import {Component} from '@angular/core';
import {delay, map, shareReplay} from 'rxjs/operators';
import {of} from 'rxjs';
import {StreamData} from '../__instrument__/streams';
import {data as DATA} from '../__instrument__/data';
import {MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';

const getStreamsLocation = (streams: StreamData[]) => {
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
  streams: StreamData[] = [];

  constructor() {
    this.dataSource.data = getStreamsLocation(DATA.streams);
    this.runSimpleExampleWithPrimitives();
    // this.runSimpleExample();
    // this.runMousePositionExample();
  }

  hasChild = (_: number, node: any) => !!node.instances && node.instances.length > 0;

  refresh() {
    this.streams = DATA.streams;
    this.dataSource.data = getStreamsLocation(DATA.streams);
  }

  private runSimpleExample() {
    const stream$ = of('a', 'b', 'c', 'd')
      .pipe(
        map((firstMap) => `${firstMap}:${firstMap}`),
        delay(1000),
        map((lastMap) => `${lastMap}:${lastMap}`),
        shareReplay(1),
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
