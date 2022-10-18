import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager.component';

import { ManagerRoutingModule } from './manager.routing';
import { InlineSVGModule } from 'ng-inline-svg';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { DashModule } from './modules/dash/dash.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    InlineSVGModule.forRoot(),
    ManagerRoutingModule,
    CommonModule,
    DashModule,
    SharedModule,

  ],
  declarations: [ManagerComponent, HeaderComponent, FooterComponent],
  exports: [ManagerComponent, HeaderComponent, FooterComponent],
  bootstrap: [

  ]
})
export class ManagerModule { }
