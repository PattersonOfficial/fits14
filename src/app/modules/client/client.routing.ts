import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../services/auth/authorizate.service';
import { Global } from '../../app.global';

import { ClientComponent } from './client.component';

const routes: Routes = [
  {
    path: '', component: ClientComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'progress',
        loadChildren: () => import('./modules/progress/progress.module').then(m => m.ProgressModule)
      },
      {
        path: 'myprogram',
        loadChildren: () => import('./modules/myprogram/myprogram.module').then(m => m.MyprogramModule)
      },
      {
        path: 'program',
        loadChildren: () => import('./modules/program/program.module').then(m => m.ProgramModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./modules/mycalendar/mycalendar.module').then(m => m.MyCalendarModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'vod',
        loadChildren: () => import('./modules/vod/vod.module').then(m => m.VideoOnDemandModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
