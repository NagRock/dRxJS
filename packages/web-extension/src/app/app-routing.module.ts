import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {EventsComponent} from './events/events.component';
import {PixiPlaygroundComponent} from './pixi-playground/pixi-playground.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path: 'pixi',
    component: PixiPlaygroundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
