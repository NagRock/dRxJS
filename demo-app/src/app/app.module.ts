import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatTreeModule} from '@angular/material';
import {TreeViewerModule} from './tree-viewer/tree-viewer.module';
import {OverlayModule} from '@angular/cdk/overlay';
import {EventsViewerModule} from './events-viewer/events-viewer.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    TreeViewerModule,
    OverlayModule,
    EventsViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
