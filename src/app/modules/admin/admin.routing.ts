import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminComponent} from './admin.component';

const routes: Routes = [
    {
        path: 'main', component: AdminComponent,
    },
    {
        path: '', component: AdminComponent,
        children: [
            {
                path: 'packages',
                loadChildren: () => import('./modules/packages/packages.module').then(m => m.PackagesModule)
            },
            {
                path: 'manage/fitness',
                loadChildren: () => import('./modules/packages/packages.module').then(m => m.PackagesModule)
            },
            {
                path: 'manage/nutrition',
                loadChildren: () => import('./modules/packages/packages.module').then(m => m.PackagesModule)
            },
            {
                path: 'manage/wellness',
                loadChildren: () => import('./modules/packages/packages.module').then(m => m.PackagesModule)
            },
            {
                path: 'users',
                loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'quotes',
                loadChildren: () => import('./modules/quotes/quotes.module').then(m => m.QuotesModule)
            },
            {
                path: 'crm/support',
                loadChildren: () => import('./modules/crm-support/crm-support.module').then(m => m.CrmSupportModule)
            },
            {
                path: 'crm/user',
                loadChildren: () => import('./modules/crm-user/crm-user.module').then(m => m.CrmUserModule)
            },
            {
                path: 'crm',
                loadChildren: () => import('./modules/crm/crm.module').then(m => m.CrmModule)
            },
            {
                path: 'questions',
                loadChildren: () => import('./modules/questions/questions.module').then(m => m.QuestionsModule)
            },
            {
                path: 'coupons',
                loadChildren: () => import('./modules/coupons/coupons.module').then(m => m.CouponsModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
