import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ButtonModule} from '../../components/button/button.module';
import {IconModule} from '../../components/icon/icon.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ButtonModule,
    IconModule
  ]
})
export class HomeModule { }
