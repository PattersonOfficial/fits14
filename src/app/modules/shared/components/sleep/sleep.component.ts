import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';

import { SleepService } from "./sleep.service";
import { StorageService } from "../../../../services/auth/storage.service";

import { SleepWidget, ReportSleepWidget } from "../../../../models/widgets/sleep/sleep.model";
import { User } from "../../../../models/user/user.model";
@Component({
  selector: 'app-client-sleep',
  templateUrl: './sleep-new.component.html',
  // templateUrl: './sleep.component.html',
  styleUrls: ['./sleep.component.css']
})

export class SleepComponent {

  public loadingBox: boolean;
  public loadingBoxModal: boolean;
  public dataReport: any[];
  public colorSets: any;
  public colorScheme: any;
  public ref: any[];
  public isVisibleIntro: boolean;
  public isVisibleInput: boolean;
  public sleep: SleepWidget;
  public user: User;
  public recommended: string;
  public hours: number;


  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
    public _sleepService: SleepService,
    public _storageService: StorageService,
  ) {
    this.sleep = new SleepWidget;
    this.dataReport = [];
    this.loadingBox = false;
    this.loadingBoxModal = false;
    this.sleep.hours = 1;
    this.isVisibleIntro = true;
    this.isVisibleInput = false;

    Object.assign(this, {
      colorSets
    });

    this.setColorScheme('flame');
    this.hours = 0;
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    this.getSleepToday();
  }

  openFormInput() {
    this.isVisibleIntro = false;
    this.isVisibleInput = true;
  }

  closeFormInput() {
    this.isVisibleIntro = true;
    this.isVisibleInput = false;
  }

  changeSliderHours(event) {
    this.sleep.hours = event.from;
  }

  saveHoursOfDay() {
    this.loadingBox = true;
    this._sleepService.postHoursToday(this.sleep).subscribe(
      data => {
        this.loadingBox = false;
        this.isVisibleIntro = true;
        this.isVisibleInput = false;
        this.getSleepToday();
      }
    )
  }


  getSleepToday() {
    this._sleepService.getSleepToday().subscribe(
      (data: any) => {
        this.hours = data.hours || 0;
      }
    )
  }


  getReportLastWeek() {
    this.loadingBoxModal = true;
    this._sleepService.getLogSleep().subscribe(
      data => {

        if (this.user.age >= 65) {
          this.recommended = "7-8";
          this.ref = [
            { value: 9, name: 'More than 8' },
            { value: 7.5, name: 'Between 7 and 8' },
            { value: 6, name: 'Less than 6' }
          ];
        }


        if (this.user.age >= 26 && this.user.age <= 64) {
          this.recommended = "7-9";
          this.ref = [
            { value: 9, name: 'More than 9' },
            { value: 8, name: 'Between 7 and 9' },
            { value: 7, name: 'Less than 7' }
          ];
        }

        if (this.user.age >= 18 && this.user.age <= 25) {
          this.recommended = "7-11";
          this.ref = [
            { value: 11, name: 'More than 11' },
            { value: 8, name: 'Between 7 and 11' },
            { value: 7, name: 'Less than 7' }
          ];
        }

        this.loadingBoxModal = false;
        this.dataReport = data;

        console.log(this.dataReport);
      }
    )
  }

  setColorScheme(name) {
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }

  openLogWeek() {
    this.modalRef.show();
    this.getReportLastWeek();
  }
}
