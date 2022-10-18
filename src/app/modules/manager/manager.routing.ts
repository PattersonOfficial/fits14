import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from "../../services/auth/authorizate.service";
import { Global } from '../../app.global';

import { ManagerComponent } from './manager.component';

const routes: Routes = [
  {
    path: '', component: ManagerComponent,
    children: [
      {
        path: 'dash',
        loadChildren: () => import('./modules/dash/dash.module').then(m => m.DashModule)
      },
      {
        path: 'assigned-user/:id',
        loadChildren: () => import('./modules/vitae/vitae.module').then(m => m.VitaeModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
