import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

import { UsersRoutingModule } from './users.routing';

import { UsersComponent } from './components/users/users.component';
import { MentorsComponent } from './components/mentors/mentors.component';
import { ManagersComponent } from './components/managers/managers.component';
import { AdministratorsComponent } from './components/administrators/administrators.component';
import { BuilderComponent } from './components/builder/builder.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    HttpClientModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    SweetAlert2Module,
    NgSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  declarations: [UsersComponent, MentorsComponent, ManagersComponent, AdministratorsComponent, BuilderComponent, MentorsComponent],
  exports: [UsersComponent, MentorsComponent, ManagersComponent, AdministratorsComponent, BuilderComponent]
})
export class UsersModule { }
