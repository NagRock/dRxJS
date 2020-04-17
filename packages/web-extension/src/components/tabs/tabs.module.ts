import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab/tab.component';
import { TabContentDirective } from './tab/tab-content.directive';

@NgModule({
  declarations: [TabsComponent, TabComponent, TabContentDirective],
  exports: [
    TabsComponent,
    TabComponent,
    TabContentDirective
  ],
  imports: [
    CommonModule
  ]
})
export class TabsModule { }
