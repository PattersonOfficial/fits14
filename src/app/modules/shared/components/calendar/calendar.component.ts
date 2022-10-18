import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

import * as moment from 'moment';

import { CalendarService } from './calendar.service';
import { StorageService } from "../../../../services/auth/storage.service";

import { User } from "../../../../models/user/user.model";

@Component({
  selector: 'app-user-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {

  public localeString: string = 'en';
  public navDate: any;
  public weekDaysHeaderArr: Array<string> = [];
  public gridArr: Array<any> = [];
  public selectedDate: any;
  public form: FormGroup;
  public user: User;
  public events: Array<any> = [];
  public viewForm: boolean;
  public event: any;
  public listMonth: any[];

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
    public _calendarService: CalendarService,
    private _formBuilder: FormBuilder,
    public _storageService: StorageService
  ) {
    this.selectedDate = moment();
    this.viewForm = false;
    this.event = {
      date: "",
      user_id: 0,
      note: "",
      time: "",
      finished_at: ""
    }
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    moment.locale(this.localeString);
    this.navDate = moment();
    this.makeHeader();
    //this.makeGrid();
    this.getEventsMonth(moment(this.navDate).format('YYYY-MM-DD'));

    this.form = this._formBuilder.group({
      user_id: [this.user.client.weight, Validators.required],
      date: [this.user.client.measurement_weight, Validators.required],
      note: [this.user.client.measurement_liquid, Validators.required]
    });


    this.getEvents(this.selectedDate.format('YYYY-MM-DD'));
  }

  openModal() {
    this.modalRef.show();
  }

  changeNavMonth(num: number) {
    if (this.canChangeNavMonth(num)) {
      this.navDate.add(num, 'month');
      //this.makeGrid();
      this.getEventsMonth(moment(this.navDate).format('YYYY-MM-DD'));
    }
  }

  canChangeNavMonth(num: number) {
    const clonedDate = moment(this.navDate);
    clonedDate.add(num, 'month');
    const minDate = moment().add(-1, 'month');
    const maxDate = moment().add(1, 'year');

    return clonedDate.isBetween(minDate, maxDate);
  }

  makeHeader() {
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
  }

  makeGrid() {
    this.gridArr = [];


    const firstDayDate = moment(this.navDate).startOf('month');
    const initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(this.navDate).endOf('month');
    const lastEmptyCells = 6 - lastDayDate.weekday();
    const daysInMonth = this.navDate.daysInMonth();
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

    for (let i = 0; i < arrayLength; i++) {
      let obj: any = {};
      if (i < initialEmptyCells || i > initialEmptyCells + daysInMonth - 1) {
        obj.value = 0;
        obj.today = false;
        obj.available = false;
      } else {
        obj.value = i - initialEmptyCells + 1;
        obj.available = this.isAvailable(i - initialEmptyCells + 1);
        obj.today = (this.dateFromNum(i - initialEmptyCells + 1, this.navDate).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') ? true : false);
        obj.activity = this.listMonth.indexOf(this.dateFromNum(i - initialEmptyCells + 1, this.navDate).format('YYYY-MM-DD')) != -1 ? true : false;
      }
      this.gridArr.push(obj);
    }
  }

  isAvailable(num: number): boolean {
    let dateToCheck = this.dateFromNum(num, this.navDate);
    if (dateToCheck.isBefore(moment(), 'day')) {
      return false;
    } else {
      return true;
    }
  }

  dateFromNum(num: number, referenceDate: any): any {
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any) {
    if (day.available) {
      this.selectedDate = this.dateFromNum(day.value, this.navDate);
      this.getEvents(this.selectedDate.format('YYYY-MM-DD'));
    }
  }

  openForm() {
    this.viewForm = true;
    this.event.date = this.selectedDate.format('YYYY-MM-DD');
    this.event.time = this.selectedDate.format('HH:mm');
    this.event.note = "";
  }

  getEvents(date) {
    let params = {
      user_id: this.user.id,
      date: date
    }
    this.viewForm = false;
    this._calendarService.getEventsDay(params).subscribe(
      data => {
        this.events = data;
      }
    )
  }

  saveEnvent() {
    this.event.user_id = this.user.id;
    this.event.finished_at = `${this.event.date} ${this.event.time}:00`;
    this._calendarService.setEventDay(this.event).subscribe(
      () => {
        this.getEvents(this.selectedDate.format('YYYY-MM-DD'));
        this.getEventsMonth(moment(this.navDate).format('YYYY-MM-DD'));
      }
    )
  }

  changeStatusOfEvent(e, event) {
    let state;
    if (e.target.checked) {
      state = 1;
    } else {
      state = 0;
    }

    this._calendarService.setStateOfEvent(event.id, state).subscribe(
      () => {
        // this.getEvents(this.selectedDate.format('YYYY-MM-DD'));
      }
    )
  }


  getEventsMonth(date) {
    this._calendarService.getEventsMonth(date).subscribe(
      (data) => {
        this.listMonth = data;
        this.makeGrid()
      }
    )
  }

}
