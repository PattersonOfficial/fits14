import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule} from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

import { QuestionsRoutingModule } from './questions.routing';

import { QuestionsComponent } from './components/questions/questions.component';

@NgModule({
  imports: [
    HttpClientModule,
    QuestionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    SweetAlert2Module,
    NgSelectModule,
    CommonModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [QuestionsComponent],
  exports: [QuestionsComponent]
})
export class QuestionsModule { }
