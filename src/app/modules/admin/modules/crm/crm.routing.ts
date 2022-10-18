import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../../../services/auth/authorizate.service';
import { Global } from '../../../../app.global';
import {CrmComponent} from './components/crm/crm.component';


const routes: Routes = [
    {
        path: ':type', component: CrmComponent,
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
export class CrmRoutingModule { }
