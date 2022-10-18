import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { UsersService } from './users.service';
import { DataTableDirective } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { Global } from '../../../../../../app.global';
import { User } from '../../../../../../models/user/user.model';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[];
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  constructor(
    public _usersService: UsersService,
    public _route: ActivatedRoute,
    public _router: Router,
    private toastService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        search: ' ',
      },
    };

    this.listUsers(Global.roles.client);
  }

  public listUsers(role): void {
    const params = new HttpParams().append('role_id', role);

    this._usersService.getUsers(params).subscribe((users) => {
      this.users = users;
      this.dtTrigger.next();
    });

    this.spinner.hide();
  }

  public pushNewContent(event) {
    this.destroyDtInstance();
    this.listUsers(Global.roles.client);
  }

  public trashUser(user: User): void {
    this._usersService.trashUser(user).subscribe(
      (response) => {
        this.toastService.success(response[1]);
        this.listUsers(Global.roles.client);
        // this.destroyDtInstance();
      },
      (error) => {
        this.toastService.error('User account deletion unsuccessful, please try again later');
      }
    );
  }

  public destroyDtInstance(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });
  }
}
