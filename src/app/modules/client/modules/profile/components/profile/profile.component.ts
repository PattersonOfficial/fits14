import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { Chart, ChartData, Point } from 'chart.js';
import { User } from '../../../../../../models/user/user.model';
import { StorageService } from '../../../../../../services/auth/storage.service';
import { QuestionsComponent } from '../../../../../shared/components/questions/questions.component';
import {MatDialog} from '@angular/material/dialog';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-bodye',
  templateUrl: './profile-new.component.html'
})

export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild(QuestionsComponent, {static: false}) questionsRef: QuestionsComponent;
  public user: User;


  constructor(
    public _storageService: StorageService,
    public dialog: MatDialog
  ) {


  }

  ngOnInit() {
    this.user = new User();
    if (this._storageService.isAuthenticated()) {
      this.user = this._storageService.getCurrentUser();
    }
    jQuery('#main-container').removeClass('opening');
    jQuery('#side_navbox').removeClass('opening');
    jQuery('#right-sidebar').removeClass('opening');
    jQuery('#footer-margin').removeClass('opening');
  }

  openDialogQuestions() {
    this.dialog.open(QuestionsComponent, {
      // width: '100vw',
      height: '100vh',
      // maxWidth: '100vw',
      hasBackdrop: false
    });
  }

  ngAfterViewInit() {
    if (this.user.client.weight <= 0 && this.user.client.height <= 0) {
      if (this.user.client.membership.id !== 4) {
        setTimeout(() => {
          this.openDialogQuestions();
        }, 10);
      }
    }
  }

}
