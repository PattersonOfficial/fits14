import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatedGuard } from '../../../../services/auth/authorizate.service';
import { Global } from '../../../../app.global';

import { VideoOnDemandComponent } from './components/vod.component';

const routes: Routes = [
    {
        path: '', component: VideoOnDemandComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: [Global.roles.client, Global.roles.mentor]
        }
    },
    {
        path: ':tab', component: VideoOnDemandComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: [Global.roles.client, Global.roles.mentor]
        }
    },
    {
        path: ':tab/:programId', component: VideoOnDemandComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: [Global.roles.client, Global.roles.mentor]
        }
    },
    {
        path: ':tab/:programId/:contentId/:contentType', component: VideoOnDemandComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: [Global.roles.client, Global.roles.mentor]
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VodRoutingModule { }
