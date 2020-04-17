import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import {TabsModule} from '../../../components/tabs/tabs.module';
import {IconModule} from '../../../components/icon/icon.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    TabsModule,
    IconModule
  ]
})
export class OverviewModule { }
