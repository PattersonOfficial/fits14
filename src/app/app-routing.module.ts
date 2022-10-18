import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RecoveryComponent } from './components/recovery/recovery.component';
import { ThankYouComponent } from './components/register/thankyou/thankyou.component';
import { AuthorizatedGuard } from './services/auth/authorizate.service';
import { RegisterComponent } from './components/register/register.component';
import { Global } from './app.global';
import { FreeRegisterComponent } from './components/free-register/free-register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth/api/google', loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule) },
  { path: 'recovery/password', component: RecoveryComponent },
  { path: 'recovery/set-password/:token', component: RecoveryComponent },
  { path: 'account/register', component: FreeRegisterComponent },
  { path: 'account/register/lead/:id', component: FreeRegisterComponent },
  { path: 'account/register/new', component: RegisterComponent },
  { path: 'account/register/thankyou', component: ThankYouComponent },
  {
    path: 'board/a',
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.administrator
    },
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'board/u',
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: [Global.roles.client, Global.roles.mentor]
    },
    loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'board/t',
    canActivate: [AuthorizatedGuard],
    data: {
      expectedRole: Global.roles.manager
    },
    loadChildren: () => import('./modules/manager/manager.module').then(m => m.ManagerModule)
  },
  { path: 'await', component: RecoveryComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
