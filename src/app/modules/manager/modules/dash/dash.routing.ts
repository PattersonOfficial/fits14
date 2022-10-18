import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from "../../../../services/auth/authorizate.service";
import { Global } from '../../../../app.global';

import { DashComponent } from './components/dash/dash.component';


const routes: Routes = [
  {
    path: '', component: DashComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.manager
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashRoutingModule { }
