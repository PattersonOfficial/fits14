import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../../../services/auth/authorizate.service';
import { Global } from '../../../../app.global';
import {CrmSupportComponent} from './components/crm-support/crm-support.component';


const routes: Routes = [
    {
        path: '', component: CrmSupportComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CrmSupportRoutingModule { }
