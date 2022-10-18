import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from "ngx-bootstrap/modal";
import { InlineSVGModule } from 'ng-inline-svg';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { SharedModule } from '../../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { VitaeRoutingModule } from './vitae.routing';
import { VitaeComponent } from './components/vitae/vitae.component';
import { MetersComponent } from './components/meters/meters.component';
import { BeforeAfterComponent } from './components/before-after/before-after.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';

@NgModule({
  imports: [
    HttpClientModule,
    VitaeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxChartsModule,
    SweetAlert2Module,
    IonRangeSliderModule,
    InlineSVGModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: '',
      confirmButtonClass: 'btn btn-primary btn-sm',
      cancelButtonClass: 'btn btn-sm btn-danger'
    }),
  ],
  declarations: [VitaeComponent, MetersComponent, BeforeAfterComponent, ProgramsComponent, QuestionnaireComponent],
  exports: [VitaeComponent, MetersComponent, BeforeAfterComponent, ProgramsComponent, QuestionnaireComponent]
})
export class VitaeModule { }
