import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { ManagersService } from './managers.service';
import { UsersService } from '../users/users.service';

import { Global } from '../../../../../../app.global';
import { User } from "../../../../../../models/user/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {

  public users;
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    public _managersService: ManagersService,
    public _usersService: UsersService
  ) {

  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": " "
      }
    };
    this.listUsers(Global.roles.manager);
  }


  /**
   * Obtiene lista de contenidos de paquete
   *
   * @return void
   */
  public listUsers(role): void {
    this._managersService.getUsers(role).subscribe(
      data => {
        this.users = data;
        this.dtTrigger.next();
      }
    )
  }

  /**
   * Inserta nuevo contenido a lista global
   *
   * @return void
   */
  public pushNewContent(event) {
    this.destroyDtInstance();
    this.listUsers(Global.roles.manager);
  }


  public trashUser(user: User): void {
    this._usersService.trashUser(user).subscribe(
      data => {
        this.destroyDtInstance();
        this.listUsers(Global.roles.manager);
      }
    )
  }


  /**
   * Destruye instancia activa DataTables
   *
   * @return void
   */
  public destroyDtInstance(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      dtInstance.destroy();
    });
  }

}
