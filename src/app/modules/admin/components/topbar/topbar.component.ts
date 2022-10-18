import { Component, OnInit } from '@angular/core';


import { User } from '../../../../models/user/user.model';
import { StorageService } from "../../../../services/auth/storage.service";
import { ContactsService } from "../../../shared/components/contacts/contacts.service"

@Component({
  selector: 'admin-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopBarComponent implements OnInit {


  public user: User;
  public pendings: number;


  constructor(
    public _storageService: StorageService,
    private _contactsService: ContactsService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();

    this._contactsService.getMyFriendsList(this.user.firestore_uid).subscribe((data) => {
      this.pendings = 0;
      data.forEach((doc) => {
        this.pendings += doc.chat.pendings;
      });
    });
  }


  openChat() {
    jQuery('#contact_box').toggleClass('opening');
  }

}
