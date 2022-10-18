import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthorizatedGuard} from '../../../../services/auth/authorizate.service';
import {Global} from '../../../../app.global';

import {PackagesComponent} from './components/packages/packages.component';
import {ContentsComponent} from './components/contents/contents.component';
import {CategoriesComponent} from './components/categories/categories.component';
import {TypesComponent} from './components/types/types.component';
import {MembershipsComponent} from './components/memberships/memberships.component';
import {PlanFitnessComponent} from './components/plan/plan_fitness/plan_fitness.component';
import {PlanNutritionComponent} from './components/plan/plan_nutrition/plan_nutrition.component';
import {PlanWellnessComponent} from './components/plan/plan_wellness/plan_wellness.component';
import {PlanVodComponent} from './components/plan/plan_vod/plan_vod.component';


const routes: Routes = [
    {
        path: 'manage', component: PackagesComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'contents/list/fitness',
        component: ContentsComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'contents/list/nutrition',
        component: ContentsComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'contents/list/wellness',
        component: ContentsComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'contents/list',
        component: ContentsComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'contents/list/:category',
        component: ContentsComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'categories/list',
        component: CategoriesComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'client-types/list',
        component: TypesComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },

    {
        path: 'client-types/list/:category',
        component: TypesComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },


    {
        path: 'memberships/list',
        component: MembershipsComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'plan/list/fitness',
        component: PlanFitnessComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'plan/list/nutrition',
        component: PlanNutritionComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'plan/list/wellness',
        component: PlanWellnessComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
    {
        path: 'plan/list/vod',
        component: PlanVodComponent,
        canActivate: [AuthorizatedGuard],
        data: {
            expectedRole: Global.roles.administrator
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackagesRoutingModule {
}
