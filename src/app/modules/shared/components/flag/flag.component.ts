import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { StorageService } from "../../../../services/auth/storage.service";
import { QuotesService } from "../../../admin/modules/quotes/components/quotes/quotes.service";

import { Quotes } from "../../../../models/quotes/quotes.model";
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'app-client-flag',
  templateUrl: './flag.component.html'
})

export class FlagComponent {

  public user: User;

  constructor(
    public _storageService: StorageService
  ) {

  }


  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();

    this._storageService.isUserChanged
      .subscribe((user) => this.user = user);
  }


}
