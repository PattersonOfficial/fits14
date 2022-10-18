import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {InlineSVGModule} from 'ng-inline-svg';
import {SharedModule} from '../../../shared/shared.module';

import {UserRoutingModule} from './user.routing';
import {UserComponent} from './components/user/user.component';



@NgModule({
    imports: [
        HttpClientModule,
        UserRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SweetAlert2Module,
        InlineSVGModule.forRoot(),
        SharedModule,
    ],
    declarations: [UserComponent],
    exports: [UserComponent]
})
export class UserModule {
}
