import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPageComponent } from './components/user-page/user-page.component';
import { CrmUserRoutingModule } from './crm-user.routing';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { FinanceComponent } from './components/finance/finance.component';
import { NotesComponent } from './components/notes/notes.component';
import { ActivityComponent } from './components/activity/activity.component';
import { NoCommaPipe } from '../../../../pipes/no-comma.pipe';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        UserPageComponent,
        UserInfoComponent,
        FinanceComponent,
        NotesComponent,
        ActivityComponent,
        NoCommaPipe,
        SendEmailComponent
    ],
    imports: [
        CommonModule,
        CrmUserRoutingModule,
        FormsModule,
        NgSelectModule,
        MatDatepickerModule,
        MatInputModule,
        ModalModule,
        TooltipModule,
        MatTooltipModule,
        FlexLayoutModule,
        ReactiveFormsModule
    ]
})
export class CrmUserModule {
}
