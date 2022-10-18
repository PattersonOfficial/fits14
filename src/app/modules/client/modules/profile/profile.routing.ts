import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthorizatedGuard} from '../../../../services/auth/authorizate.service';
import {Global} from '../../../../app.global';

import {ProfileComponent} from './components/profile/profile.component';


const routes: Routes = [
    {
        path: ':tab', component: ProfileComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: [Global.roles.client, Global.roles.mentor]
        }
    },
    {
        path: '', component: ProfileComponent,
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
export class ProfileRoutingModule {
}
