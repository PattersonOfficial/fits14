import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InlineSVGModule } from 'ng-inline-svg';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { SharedModule } from '../../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { DashRoutingModule } from './dash.routing';
import { DashComponent } from './components/dash/dash.component';


@NgModule({
  imports: [
    HttpClientModule,
    DashRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module,
    IonRangeSliderModule,
    InlineSVGModule.forRoot(),
    SharedModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: '',
      confirmButtonClass: 'btn btn-primary btn-sm',
      cancelButtonClass: 'btn btn-sm btn-danger'
    }),
  ],
  declarations: [DashComponent],
  exports: [DashComponent]
})
export class DashModule { }
