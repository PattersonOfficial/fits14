import { Component, OnInit, ViewChild } from '@angular/core';

import { LoginService } from "../../../../components/login/login.service";
import { StorageService } from "../../../../services/auth/storage.service";
import { ContactsService } from "../../../shared/components/contacts/contacts.service"
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';

import { User } from '../../../../models/user/user.model';


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'manager-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent {

  public user: User;
  public pendings: number;

  @ViewChild(CalendarComponent, {static: false}) CalendarComponentRef: CalendarComponent;

  constructor(
    public _loginService: LoginService,
    public _storageService: StorageService,
    private _contactsService: ContactsService
  ) {
    this.pendings = 0;
  }


  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();


    this._storageService.isUserChanged
      .subscribe((user) => this.user = user);

    // this._socket
    //   .getDataUser()
    //   .subscribe(data => {
    //
    //   });

    this._contactsService.getMyFriendsList(this.user.firestore_uid).subscribe((data) => {
      this.pendings = 0;
      data.forEach((doc) => {
        this.pendings += doc.chat.pendings;
      });
    });

  }

  showCalendar() {
    this.CalendarComponentRef.openModal();
  }

  openChat() {
    jQuery('#contact_box').toggleClass('opening');
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
