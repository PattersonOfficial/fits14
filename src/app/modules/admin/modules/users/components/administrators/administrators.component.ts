import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AdministratorsService } from './administrators.service';
import { UsersService } from '../users/users.service';

import { Global } from '../../../../../../app.global';
import { User } from "../../../../../../models/user/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.css']
})
export class AdministratorsComponent implements OnInit {

  public users;
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    public _administratorsService: AdministratorsService,
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
    this.listUsers(Global.roles.administrator);
  }


  /**
   * Obtiene lista de contenidos de paquete
   *
   * @return void
   */
  public listUsers(role): void {
    this._administratorsService.getUsers(role).subscribe(
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
    this.listUsers(Global.roles.administrator);
  }


  public trashUser(user: User): void {
    console.log(user);
    this._usersService.trashUser(user).subscribe(
      data => {
        this.destroyDtInstance();
        this.listUsers(Global.roles.administrator);
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
