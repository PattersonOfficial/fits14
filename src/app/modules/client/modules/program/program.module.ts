import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { InlineSVGModule } from 'ng-inline-svg';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { SharedModule } from '../../../shared/shared.module';
import { NestableModule } from 'ngx-nestable';
import { PackagesModule } from '../../../admin/modules/packages/packages.module';

import { ProgramRoutingModule } from './program.routing';
import { ProgramComponent } from './components/program/program.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  imports: [
    HttpClientModule,
    ProgramRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module,
    IonRangeSliderModule,
    InlineSVGModule.forRoot(),
    SharedModule,
    NestableModule,
    PackagesModule,
    SlickCarouselModule
  ],
  declarations: [ProgramComponent],
  exports: [ProgramComponent]
})
export class ProgramModule { }
