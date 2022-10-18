import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmSupportComponent } from './components/crm-support/crm-support.component';
import { CrmSupportRoutingModule } from './crm-support.routing';
import {MatTableModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../../../shared/shared.module';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { TicketMailHistoryComponent } from './components/ticket-mail-history/ticket-mail-history.component';
import { ViewPostComponent } from './components/view-post/view-post.component';


@NgModule({
    declarations: [CrmSupportComponent, AddTicketComponent, EditTicketComponent, SendEmailComponent, TicketMailHistoryComponent, ViewPostComponent],
    imports: [
        CommonModule,
        CrmSupportRoutingModule,
        MatTableModule,
        FormsModule,
        ModalModule,
        Ng2TelInputModule,
        NgSelectModule,
        SharedModule
    ]
})
export class CrmSupportModule { }
