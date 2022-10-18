import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {StorageService} from '../../../../services/auth/storage.service';
import {User} from '../../../../models/user/user.model';
import * as moment from 'moment';

@Component({
  selector: 'app-card-open-dialog',
  templateUrl: './creditcarddetail.component.html',
})
export class CardOpenDialogComponent implements OnInit {

  public user: User;
  public moment: any = moment;
  dataModel: any;

  constructor(
      public dialogRef: MatDialogRef<CardOpenDialogComponent>,
      private _storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  paymentCallback(result) {
    if (result) {
      this.dialogRef.close();
    }
  }
}
