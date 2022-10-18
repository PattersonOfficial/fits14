import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthorizatedGuard} from '../../../../services/auth/authorizate.service';
import {Global} from '../../../../app.global';
import {CouponsComponent} from './components/coupons/coupons.component';

const routes: Routes = [
    {
        path: '', component: CouponsComponent,
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
export class CouponsRoutingModule {
}
