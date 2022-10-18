import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from "../../../../services/auth/authorizate.service";
import { Global } from '../../../../app.global';

import { UsersComponent } from './components/users/users.component';
import {MentorsComponent} from './components/mentors/mentors.component';
import { ManagersComponent } from './components/managers/managers.component';
import { AdministratorsComponent } from './components/administrators/administrators.component';
import { BuilderComponent } from './components/builder/builder.component';

const routes: Routes = [
  {
    path: '', component: UsersComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'create', component: BuilderComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'create/:type', component: BuilderComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'view/clients', component: UsersComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'view/mentors', component: MentorsComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'view/managers', component: ManagersComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'view/administrators', component: AdministratorsComponent,
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    }
  },
  {
    path: 'edit/:type/:id', component: BuilderComponent,
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
export class UsersRoutingModule { }
