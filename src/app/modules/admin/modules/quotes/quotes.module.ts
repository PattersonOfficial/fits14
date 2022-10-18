import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuotesRoutingModule } from './quotes.routing';
import { ModalModule} from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { QuillModule } from 'ngx-quill'
import { ngfModule, ngf } from "angular-file"
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import 'hammerjs';
import 'mousetrap';
import { ModalGalleryModule } from 'angular-modal-gallery';

import { TokenInterceptor } from "../../../../services/auth/tokenInterceptor.service";
import { JwtInterceptor } from "../../../../services/auth/jwtInterceptor.service";
import { NoSanitizePipe } from "../../../../pipes/sanitize.pipe";

import { QuotesComponent } from './components/quotes/quotes.component';
import { NestableModule } from 'ngx-nestable';


@NgModule({
  imports: [
    QuotesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NestableModule,
    ModalModule.forRoot(),
    DataTablesModule,
    QuillModule,
    ngfModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: '',
      confirmButtonClass: 'btn btn-primary btn-sm',
      cancelButtonClass: 'btn btn-sm btn-danger'
    }),
    ModalGalleryModule.forRoot()
  ],
  providers: [],
  declarations: [QuotesComponent],
  exports: [ModalModule, DataTablesModule, QuotesComponent]

})
export class QuotesModule { }
