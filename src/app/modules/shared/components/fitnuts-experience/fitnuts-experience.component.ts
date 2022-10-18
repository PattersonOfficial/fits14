import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fitnuts-experience',
  templateUrl: './fitnuts-experience.component.html',
  styleUrls: ['./fitnuts-experience.component.css']
})
export class FitnutsExperienceComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<FitnutsExperienceComponent>,) { }

  ngOnInit() {
  }


  closeModal(status): void {
    this.dialogRef.close(status);
  }
}
