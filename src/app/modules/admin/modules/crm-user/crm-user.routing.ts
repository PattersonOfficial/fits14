import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../../../services/auth/authorizate.service';
import { Global } from '../../../../app.global';
import {UserPageComponent} from './components/user-page/user-page.component';


const routes: Routes = [
    {
        path: ':userId/:tab', component: UserPageComponent,
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
export class CrmUserRoutingModule { }
