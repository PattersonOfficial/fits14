import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DataTablesModule} from 'angular-datatables';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {NgSelectModule} from '@ng-select/ng-select';
import {CouponsRoutingModule} from './coupons.routing';
import {CouponsComponent} from './components/coupons/coupons.component';

@NgModule({
    imports: [
        HttpClientModule,
      CouponsRoutingModule,
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
    declarations: [CouponsComponent],
    exports: [CouponsComponent]
})
export class CouponsModule {
}
