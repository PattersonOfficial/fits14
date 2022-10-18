import { NumbersonlyModule } from './../common/numbersonly/numbersonly.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin.routing';

import { UsersModule } from './modules/users/users.module';
import { PackagesModule } from './modules/packages/packages.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { CrmModule} from './modules/crm/crm.module';
import { SharedModule } from '../shared/shared.module';
// search module
// import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AdminComponent } from './admin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopBarComponent } from './components/topbar/topbar.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    UsersModule,
    CommonModule,
    PackagesModule,
    QuestionsModule,
    SharedModule,
    CrmModule,
    NumbersonlyModule,
    // Ng2SearchPipeModule
  ],
  declarations: [AdminComponent, SidebarComponent, TopBarComponent],
  exports: [AdminComponent, SidebarComponent, TopBarComponent, CrmModule],
})
export class AdminModule {}
