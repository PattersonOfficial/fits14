import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmComponent } from './components/crm/crm.component';
import { CrmRoutingModule } from './crm.routing';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule, MatFormFieldModule, MatSelectModule, MatSortModule, MatTableModule} from '@angular/material';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import { AddLeadComponent } from './components/add-lead/add-lead.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        CrmRoutingModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatSelectModule,
        ModalModule,
        MatDatepickerModule,
        Ng2TelInputModule,
        NgSelectModule,
    ],
  declarations: [CrmComponent, EditUserComponent, AddLeadComponent],
  exports: [CrmComponent],
})

export class CrmModule { }
