import { Component, Inject, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/auth/storage.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent implements OnInit {
  // user: User;


  constructor(
    public _storageService: StorageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CongratsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // console.log({CongratsData: this.data });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
