import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthorizatedGuard} from '../../../../services/auth/authorizate.service';
import {Global} from '../../../../app.global';

import {MyCalendarComponent} from './components/mycalendar/mycalendar.component';


const routes: Routes = [
    {
        path: '', component: MyCalendarComponent,
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
export class MyCalendarRoutingModule {
}
