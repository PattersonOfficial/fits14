import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {InlineSVGModule} from 'ng-inline-svg';
import {SharedModule} from '../../../shared/shared.module';

import {MyCalendarRoutingModule} from './mycalendar.routing';
import {MyCalendarComponent} from './components/mycalendar/mycalendar.component';

import { MatDatepicker, MatDatepickerModule } from '@angular/material';
// import { MaterialFileInputModule } from 'ngx-material-file-input'; //npm i ngx-material-file-input
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { InputFileConfig, InputFileModule } from 'ngx-input-file';//npm install ngx-input-file --save
// import { MatToolbarModule } from '@angular/material/toolbar';



// const config: InputFileConfig = {
//     fileAccept: '*',
//     fileLimit: 1
// };



@NgModule({
    imports: [
        HttpClientModule,
        MyCalendarRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SweetAlert2Module,
        InlineSVGModule.forRoot(),
        SharedModule,
        // MaterialFileInputModule
        // BrowserAnimationsModule,
        // InputFileModule.forRoot(config),
        // MatToolbarModule,
        // FormsModule
        MatDatepickerModule
    ],
    declarations: [MyCalendarComponent],
    exports: [MyCalendarComponent]
})
export class MyCalendarModule {
}
