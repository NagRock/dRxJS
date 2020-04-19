import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import {TabsModule} from '../../../components/tabs/tabs.module';
import {IconModule} from '../../../components/icon/icon.module';
import {SourceSelectorModule} from './source-selector/source-selector.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    TabsModule,
    IconModule,
    SourceSelectorModule
  ]
})
export class OverviewModule { }
