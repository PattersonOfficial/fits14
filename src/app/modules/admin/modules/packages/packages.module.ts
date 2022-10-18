import { NumbersonlyModule } from './../../../common/numbersonly/numbersonly.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PackagesRoutingModule} from './packages.routing';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DataTablesModule} from 'angular-datatables';
import {QuillModule} from 'ngx-quill';
import {ngfModule} from 'angular-file';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {NestableModule} from 'ngx-nestable';
import 'hammerjs';
import 'mousetrap';
import {ModalGalleryModule} from 'angular-modal-gallery';
import {NoSanitizePipe} from '../../../../pipes/sanitize.pipe';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {PackagesComponent} from './components/packages/packages.component';
import {CKEditorModule} from 'ckeditor4-angular';
import {ContentsComponent} from './components/contents/contents.component';
import {CategoriesComponent} from './components/categories/categories.component';
import {TypesComponent} from './components/types/types.component';
import {MembershipsComponent} from './components/memberships/memberships.component';
import {BuilderComponent} from './components/builder/builder.component';
import {WebViewComponent} from './components/webview/webview.component';

import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {PlanNutritionComponent} from './components/plan/plan_nutrition/plan_nutrition.component';
import {PlanFitnessComponent} from './components/plan/plan_fitness/plan_fitness.component';
import {PlanWellnessComponent} from './components/plan/plan_wellness/plan_wellness.component';
import {PlanVodComponent} from './components/plan/plan_vod/plan_vod.component';
import {PaymentFormComponent} from './components/payment-form/payment-form.component';
import {AngularCropperjsModule} from 'angular-cropperjs';
import {MatProgressSpinnerModule} from '@angular/material';
import { PaymentComponent } from './components/payment/payment.component';
import { RegisterPaymentComponent } from './components/register-payment/register-payment.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    DragDropModule,
    PackagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NestableModule,
    CodemirrorModule,
    ModalModule.forRoot(),
    DataTablesModule,
    QuillModule,
    CKEditorModule,
    ngfModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: '',
      confirmButtonClass: 'btn btn-primary btn-sm',
      cancelButtonClass: 'btn btn-sm btn-danger',
    }),
    ModalGalleryModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    AngularCropperjsModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    NumbersonlyModule,
  ],
  providers: [],
  declarations: [
    PackagesComponent,
    ContentsComponent,
    CategoriesComponent,
    MembershipsComponent,
    PlanNutritionComponent,
    PlanFitnessComponent,
    PlanWellnessComponent,
    PlanVodComponent,
    BuilderComponent,
    WebViewComponent,
    TypesComponent,
    NoSanitizePipe,
    PaymentFormComponent,
    PaymentComponent,
    RegisterPaymentComponent,
  ],
  exports: [
    ModalModule,
    ContentsComponent,
    DataTablesModule,
    CategoriesComponent,
    TypesComponent,
    MembershipsComponent,
    PlanNutritionComponent,
    PlanFitnessComponent,
    PlanVodComponent,
    BuilderComponent,
    PackagesComponent,
    WebViewComponent,
    NoSanitizePipe,
    PaymentFormComponent,
    PaymentComponent,
    RegisterPaymentComponent,
  ],
})
export class PackagesModule {}
