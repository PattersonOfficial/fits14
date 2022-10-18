import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from "../../../../services/auth/authorizate.service";
import { Global } from '../../../../app.global';

import { QuestionsComponent } from './components/questions/questions.component';

const routes: Routes = [
  {
    path: '', component: QuestionsComponent,
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
export class QuestionsRoutingModule { }
