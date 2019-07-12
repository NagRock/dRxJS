import {Component} from '@angular/core';
import {data as DATA} from '../__instrument__/data';
import {MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {EventModel, getModel, Model, StreamModel} from './model';
import {getEvents} from './events';
import {runSimpleExample} from './examples';


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
    // runSimpleExampleWithPrimitives();
    runSimpleExample();
    // runMousePositionExample();
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
}
