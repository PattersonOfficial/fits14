import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalService } from 'src/app/services/modal/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() program: any;
  modalService: ModalService;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    modalService: ModalService
  ) {
    this.modalService = modalService;
  }

  ngOnInit() {}

  playProgram() {
    this.dialogRef.close({
      data: 'trailer',
    });
  }

  addProgram() {
    this.dialogRef.close({
      data: 'program',
    });
  }
}
