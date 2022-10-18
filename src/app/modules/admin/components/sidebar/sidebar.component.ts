import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../../../components/login/login.service";
import { StorageService } from "../../../../services/auth/storage.service";
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public user: User;
  public islogged: boolean;
  constructor(
    public _loginService: LoginService,
    public _storageService: StorageService
  ) { }

  ngOnInit() {
    this.islogged = this._storageService.isAuthenticated();

    this._storageService.isLogged
      .subscribe((status) => this.islogged = status);

    this._storageService.isUserChanged
      .subscribe((user) => this.user = user);

    if (this.islogged) {
      this.user = this._storageService.getCurrentUser();
    }
  }

  public logout(): void {
    this._loginService.logout().subscribe(
      response => {
        if (response) {
          this._storageService.logout();
        }
      },
      error => {
        this._storageService.logout();
      }
    );
  }

}
