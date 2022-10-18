import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngfModule, ngf } from "angular-file"
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { InlineSVGModule } from 'ng-inline-svg';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SharedModule } from '../../../shared/shared.module';
import { NestableModule } from 'ngx-nestable';
import { PackagesModule } from '../../../admin/modules/packages/packages.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import {NgApexchartsModule} from 'ng-apexcharts';
import { ProgressRoutingModule } from './progress.routing';
import { ProgressComponent } from './components/progress/progress.component';
import { MetersComponent } from './components/meters/meters.component';
import {MatIconModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import { AreaChartComponent } from './components/area-chart/area-chart.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import { AreaChartSleepComponent } from './components/area-chart-sleep/area-chart-sleep.component';
import { AreaChartWaterComponent } from './components/area-chart-water/area-chart-water.component';
import { AreaChartSmokingComponent } from './components/area-chart-smoking/area-chart-smoking.component';

@NgModule({
  imports: [
    HttpClientModule,
    ProgressRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module,
    IonRangeSliderModule,
    InlineSVGModule.forRoot(),
    SharedModule,
    NgxChartsModule,
    NestableModule,
    ngfModule,
    PackagesModule,
    MatIconModule,
    MatTabsModule,
    // NgApexchartsModule,
    NgCircleProgressModule.forRoot({})
  ],
  declarations: [MetersComponent, ProgressComponent, AreaChartComponent, AreaChartSleepComponent, AreaChartWaterComponent, AreaChartSmokingComponent],
  exports: [MetersComponent, ProgressComponent]
})
export class ProgressModule { }
