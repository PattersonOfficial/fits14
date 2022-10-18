import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../../../services/auth/authorizate.service';
import { Global } from '../../../../app.global';

import { ProgramComponent } from './components/program/program.component';


const routes: Routes = [
  {
    path: '', component: ProgramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },
  {
    path: 'filter/:type/:section', component: ProgramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },
  {
    path: 'filter/:type/:section/:tab', component: ProgramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },
  {
    path: 'filter/:type/:section/:tab/:article', component: ProgramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },
  {
    path: 'nutrition/:type', component: ProgramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  }
]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
