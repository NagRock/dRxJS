import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {EventsComponent} from './events/events.component';
import {PixiPlaygroundComponent} from './pixi-playground/pixi-playground.component';
import {OverviewComponent} from './views/overview/overview.component';

const routes: Routes = [
  {
    path: '',
    // component: HomeComponent,
    component: OverviewComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path: 'pixi',
    component: PixiPlaygroundComponent,
  },
  {
    path: 'overview',
    component: OverviewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
