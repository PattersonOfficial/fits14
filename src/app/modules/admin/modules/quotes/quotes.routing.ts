import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from "../../../../services/auth/authorizate.service";
import { Global } from '../../../../app.global';

import { QuotesComponent } from './components/quotes/quotes.component';

const routes: Routes = [
  {
    path: '', component: QuotesComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'builder',
    component: QuotesComponent,
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
export class QuotesRoutingModule { }
