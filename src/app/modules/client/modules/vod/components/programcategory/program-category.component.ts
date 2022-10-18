import { FitnutsExperienceComponent } from './../../../../../shared/components/fitnuts-experience/fitnuts-experience.component';
import { StorageService } from './../../../../../../services/auth/storage.service';
import { ChangePlanComponent } from './../../../../../shared/components/change-plan/change-plan.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VodProgram } from '../../../../../../models/vodprogram/vodprogram.model';
import { User } from '../../../../../../models/user/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-client-programcategory',
  templateUrl: './program-category.component.html',
  styleUrls: ['./program-category.component.css'],
})
export class ProgramCategoryComponent implements OnInit {
  @Input() program: VodProgram;
  @Input() user: User;
  @Input() isMore: boolean;
  @Input() isPopular: boolean;
  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();
  @Output() onShowPaymentModal: EventEmitter<any> = new EventEmitter();
  @Output() onSubscribeSlider: EventEmitter<any> = new EventEmitter();
  @Output() onShowModal: EventEmitter<any> = new EventEmitter();

  public isActive: boolean;
  currentModalProgram: any;
  noProgramPopup = false;

  constructor(
    private modalService: ModalService,
    public _router: Router,
    public dialog: MatDialog,
    public _storageService: StorageService
  ) {
    this.isActive = false;
  }

  ngOnInit() {}

  public handlePlayClick() {
    window['dataLayer'].push({
      event: 'VOD Trailer',
      program_title: this.program.title,
    });

    this.onPlayVideo.emit(this.program);
  }

  public getStarted(program) {
    const user = this._storageService.getCurrentUser();

    if (user.client.membership.id === 4) {
      this.openDialogPlan(program);
    } else {
      this.onSubscribeSlider.emit(program);
    }
  }

  openDialogPlan(program): void {
    this.dialog
      .open(FitnutsExperienceComponent, {})
      .afterClosed()
      .subscribe((resp) => {
        if (resp === true) {
          this.dialog
            .open(ChangePlanComponent, {
              data: 'VOD'
            })
            .afterClosed()
            .subscribe((resp) => {
              if (resp.success === true) {
                this._storageService.refreshUserData();
                this.onSubscribeSlider.emit(program);
              }
            });
        }
    });
  }

  openModal() {
    if (window.innerWidth <= 720) {
      this.modalService.openModal(this.program);
      this.modalService.modalClosed.subscribe((result) => {
        if (result && result.data === 'program') {
          this.getStarted(this.program);
        }
        if (result && result.data === 'trailer') {
          this.handlePlayClick();
        }
      });
    }
  }
}
