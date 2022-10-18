import { Component, OnInit, ViewChild} from '@angular/core';

import { ValidateComponent } from './components/validate/validate.component';
import { StorageService } from './services/auth/storage.service';
import { BuilderService } from './modules/admin/modules/users/components/builder/builder.service';

import { User } from './models/user/user.model';
import { Global, GlobalRoles } from './app.global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements OnInit {
  public title: string | any;
  public user: User | any;
  public roles: GlobalRoles | any;
  public isLogged: boolean | any;

  @ViewChild(ValidateComponent, {static: false}) modalValidate: ValidateComponent | any;

  constructor(
    public _storageService: StorageService,
    public _userService: BuilderService,
  ) {

  }

  ngOnInit() {

    this.roles = Global.roles;
    this.user = new User();

    this.isLogged = this._storageService.isAuthenticated();

    this._storageService.isLogged
        .subscribe((status) => {
              this.isLogged = status;
            }
        );

    this._storageService.isUserChanged
        .subscribe((user) => this.user = user);

    if (this.isLogged) {
      this.user = this._storageService.getCurrentUser();
      this._storageService.setUserSession(this.user);
    }
  }


  public updateSocketUser(data: User): void {
    this._userService.updateSocket(data).subscribe(
        () => {
        this._storageService.setUserSession(this.user);
      }
    );
  }

}
