import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InlineSVGModule } from 'ng-inline-svg';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SharedModule } from '../../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { HomeRoutingModule } from './home.routing';
import { HomeComponent } from './components/home/home.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NestableModule } from 'ngx-nestable';
import { ngfModule } from 'angular-file';
import { PackagesModule } from '../../../admin/modules/packages/packages.module';

import { OwlModule } from 'ngx-owl-carousel';

@NgModule({
  imports: [
    HttpClientModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module,
    IonRangeSliderModule,
    InlineSVGModule.forRoot(),
    SharedModule,
    OwlModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: '',
      confirmButtonClass: 'btn btn-primary btn-sm',
      cancelButtonClass: 'btn btn-sm btn-danger'
    }),
    NgxChartsModule,
    NestableModule,
    ngfModule,
    PackagesModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeModule {}
