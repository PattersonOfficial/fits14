import { Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WebViewComponent } from '../../../../../admin/modules/packages/components/webview/webview.component';
import { MetersService } from './meters.service';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { QuestionsComponent } from '../../../../../shared/components/questions/questions.component';

import { StorageService } from '../../../../../../services/auth/storage.service';
import { User } from '../../../../../../models/user/user.model';

import * as moment from 'moment';

@Component({
  selector: 'app-client-meters',
  // templateUrl: './meters.component.html',
  templateUrl: './meters-new.component.html',
  styleUrls: ['./meters.component.css'],
})

export class MetersComponent implements OnInit, DoCheck {

  public user: User;
  public loadingBox: boolean;
  public colorScheme: any;
  public colorCigars: any;
  public dataSleep = [];
  public dataWater = [];
  public dataSmoke = [];
  public form: FormGroup;
  public colorSets: any;
  public SleepRecommended: string;
  public refWater: any[];
  public refSleep: any[];
  public refSmoke: any[];
  public measurement: string;
  public recommendedWater: number;
// -------------------------------
  public progress: any = [];
  public bmiToChart = [];
  public sleepToChart = [];
  public waterToChart = [];
  public smokeToChart = [];
  public bmiMeasure = '';
  public sleepMeasure = '';
  public waterMeasure = '';
  public smokeMeasure = '';

  public bmiArea = [];
  public waterArea = [];
  public sleepArea = [];
  public smokingArea = [];

  @ViewChild(QuestionsComponent, {static: false}) questionsRef: QuestionsComponent;
  @ViewChild(WebViewComponent, {static: false}) webview: WebViewComponent;

  constructor(
    public _storageService: StorageService,
    public _metersService: MetersService,
    public _route: ActivatedRoute,
    public _router: Router,
    private _formBuilder: FormBuilder,
  ) {
    this.loadingBox = false;

    Object.assign(this, {
      colorSets
    });

    this.setColorScheme('flame');
    this.colorCigars = this.colorSets.find(s => s.name === 'air');
  }

  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();
    this.measurement = 'ml';
    this._storageService.isUserChanged
      .subscribe((user) => {
        this.user = user;
      });

    this.form = this._formBuilder.group({
      client_id: [this.user.client.id, Validators.required],
      from: [moment().subtract(30, 'days').format('YYYY-MM-DD')],
      to: [moment().add(1, 'days').format('YYYY-MM-DD')]
    });

    this.getAllReports();
    this.createCharts();
  }

  ngDoCheck() {
    this.createCharts();
  }

  createCharts() {
    this.bmiArea = [{
      data: this.bmiToChart,
      name: this.bmiMeasure
    }];

    this.sleepArea = [{
      data: this.sleepToChart,
      name: this.sleepMeasure
    }];

    this.waterArea = [{
      data: this.waterToChart,
      name: this.waterMeasure
    }];

    this.smokingArea = [{
      data: this.smokeToChart,
      name: this.smokeMeasure
    }];
  }

  createXAxis(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[new Date(date).getDay()]}, ${new Date(date).getDate()}`;
  }

  getAllReports() {
    this._metersService.getAllProgress().subscribe(
        data => {
          this.progress = data;
          this.progress.bmi_progress.series.forEach( item => {
            this.bmiToChart.push({ x: this.createXAxis(item.date), y: item.bmi });
          });
          this.bmiMeasure = this.progress.bmi_progress.name;
          this.progress.sleep_progress.series.forEach( item => {
            this.sleepToChart.push({ x: this.createXAxis(item.date), y: item.value });
          });
          this.sleepMeasure = this.progress.sleep_progress.name;
          this.progress.water_progress.series.forEach( item => {
            this.waterToChart.push({ x: this.createXAxis(item.name), y:  item.value});
          });
          this.waterMeasure = this.progress.water_progress.name;
          this.progress.smok_progress.series.forEach( item => {
            this.smokeToChart.push({ x: this.createXAxis(item.date), y: item.value });
          });
          this.smokeMeasure = this.progress.smok_progress.name;
        }
    );
  }


  // Old Functionality
  setColorScheme(name) {
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }
  getReportSleep() {
    this._metersService.getLogOfRangeSleep(this.form.value).subscribe(
        data => {

          if (this.user.age >= 65) {
            this.SleepRecommended = '7-8';
            this.refSleep = [
              { value: 9, name: 'More than 8' },
              { value: 7.5, name: 'Between 7 and 8' },
              { value: 6, name: 'Less than 6' }
            ];
          }

          if (this.user.age >= 26 && this.user.age <= 64) {
            this.SleepRecommended = '7-9';
            this.refSleep = [
              { value: 9, name: 'More than 9' },
              { value: 8, name: 'Between 7 and 9' },
              { value: 7, name: 'Less than 7' }
            ];
          }

          if (this.user.age >= 18 && this.user.age <= 25) {
            this.SleepRecommended = '7-11';
            this.refSleep = [
              { value: 11, name: 'More than 11' },
              { value: 8, name: 'Between 7 and 11' },
              { value: 7, name: 'Less than 7' }
            ];
          }
          this.dataSleep = data;
        }
    );
  }
  getReportWater(measurement) {
    this.recommendedWater = this.calculateFeee(this.user.client.weight, this.measurement);
    this._metersService.getLogOfRangeWater(this.form.value, measurement).subscribe(
        data => {

          this.refWater = [
            { value: this.recommendedWater, name: '' }
          ];
          this.dataWater = data;
        }
    );
  }
  reportInOunces(event) {
    if (event.currentTarget.checked) {
      this.measurement = 'oz';
    } else {
      this.measurement = 'ml';
    }
    this.getReportWater(this.measurement);
  }
  calculateFeee(weight, measure) {
    let kg = weight;
    let extra = 0;
    if (this.user.client.measurement_weight === 'lb') {
      kg = Math.ceil(weight * 0.453592);
    }

    if (this.user.gender === 'M') {
      extra = 750;
    }

    if (this.user.gender === 'F') {
      extra = 250;
    }

    const ml = Math.ceil((Math.ceil(kg) * 30) + extra);
    if (measure === 'oz') {
      return Math.ceil(ml * 0.033814);
    } else {
      return ml;
    }
  }
}
