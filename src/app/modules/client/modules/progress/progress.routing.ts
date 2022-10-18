import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../../../services/auth/authorizate.service';
import { Global } from '../../../../app.global';

import { ProgressComponent } from './components/progress/progress.component';


const routes: Routes = [
  {
    path: '', component: ProgressComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressRoutingModule { }
