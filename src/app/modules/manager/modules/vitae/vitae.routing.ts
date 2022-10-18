import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from "../../../../services/auth/authorizate.service";
import { Global } from '../../../../app.global';

import { VitaeComponent } from './components/vitae/vitae.component';


const routes: Routes = [
  {
    path: '', component: VitaeComponent,
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
export class VitaeRoutingModule { }
