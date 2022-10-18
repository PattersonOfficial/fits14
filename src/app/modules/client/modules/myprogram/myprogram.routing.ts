import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../../../services/auth/authorizate.service';
import { Global } from '../../../../app.global';

import { MyprogramComponent } from './components/myprogram/myprogram.component';
import {ProgramComponent} from '../program/components/program/program.component';


const routes: Routes = [
  {
    path: '', component: MyprogramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },
  {
    path: 'filter/:type/:section', component: MyprogramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },
  {
    path: 'filter/:type/:section/:tab', component: MyprogramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },
  // {
  //   path: 'filter/:type/:section/:tab/:single-workout', component: MyprogramComponent,
  //   canActivate: [AuthorizatedGuard],
  //   data: {
  //     expectedRole: Global.roles.client
  //   }
  // },
  {
    path: 'filter/:type/:section/:tab/:contentId', component: MyprogramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }
  },


  {
    path: 'nutrition/:type', component: MyprogramComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    }


  }
  // {
  //   path: 'filter/:section/:subsection/:type', component: MyprogramComponent,
  //   canActivate: [AuthorizatedGuard],
  //   data: {
  //     expectedRole: Global.roles.client
  //   }
  // },
  // {
  //   path: 'filter/:section', component: MyprogramComponent,
  //   canActivate: [AuthorizatedGuard],
  //   data: {
  //     expectedRole: Global.roles.client
  //   }
  // },
  // {
  //   path: 'filter/:section/:subsection', component: MyprogramComponent,
  //   canActivate: [AuthorizatedGuard],
  //   data: {
  //     expectedRole: Global.roles.client
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyprogramRoutingModule { }
