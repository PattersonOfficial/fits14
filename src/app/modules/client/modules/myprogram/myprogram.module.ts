import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngfModule, ngf } from 'angular-file';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { InlineSVGModule } from 'ng-inline-svg';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SharedModule } from '../../../shared/shared.module';
import { NestableModule } from 'ngx-nestable';
import { PackagesModule } from '../../../admin/modules/packages/packages.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OwlModule } from 'ngx-owl-carousel';
import { MyprogramRoutingModule } from './myprogram.routing';
import { MyprogramComponent } from './components/myprogram/myprogram.component';
import { NgCircleProgressModule } from 'ng-circle-progress';//npm install ng-circle-progress --save

import {MatProgressBarModule} from '@angular/material/progress-bar';
@NgModule({
  imports: [
    HttpClientModule,
    MyprogramRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module,
    IonRangeSliderModule,
    InlineSVGModule.forRoot(),
    SharedModule,
    MatProgressBarModule,
    NgxChartsModule,
    NestableModule,
    ngfModule,
    PackagesModule,
    OwlModule,
    NgCircleProgressModule.forRoot({})
  ],
  declarations: [MyprogramComponent],
  exports: [MyprogramComponent]
})
export class MyprogramModule { }
