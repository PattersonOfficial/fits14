import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MetersService } from './meters.service';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';

import { StorageService } from '../../../../../../services/auth/storage.service';
import { User } from '../../../../../../models/user/user.model';

import * as moment from 'moment';

@Component({
  selector: 'app-managers-meters',
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.css'],
})

export class MetersComponent implements OnInit {

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


  @Input() public uid: number;
  @Input() public client_id: number;

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
    this.user = new User();
  }

  ngOnInit() {
    this.getUser(this.uid);
    this.measurement = 'ml';

    this.form = this._formBuilder.group({
      client_id: [this.client_id, Validators.required],
      from: [moment().subtract(30, 'days').format('YYYY-MM-DD')],
      to: [moment().add(1, 'days').format('YYYY-MM-DD')]
    });

    this.getDataReports();
  }


  getUser(id: number) {
    this._metersService.getUser(id).subscribe(
      data => {
        console.log(data);
        this.user = data;
      }
    );
  }

  setColorScheme(name) {
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }

  getDataReports() {
    this.getReportSleep();
    this.getReportWater(this.measurement);
    this.getReportSmoke();
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
    if (this.user.client.measurement_weight == 'lb') {
      kg = Math.ceil(weight * 0.453592);
    }

    if (this.user.gender == 'M') {
      extra = 750;
    }

    if (this.user.gender == 'F') {
      extra = 250;
    }

    //let ml = Math.ceil(0.85 * ((Math.ceil(kg) / 30) + extra));
    const ml = Math.ceil((Math.ceil(kg) * 30) + extra);
    if (measure == 'oz') {
      return Math.ceil(ml * 0.033814);
    } else {
      return ml;
    }
  }


  getReportSmoke() {
    this._metersService.getLogOfRangeSmoke(this.form.value).subscribe(
      data => {
        this.dataSmoke = data;
      }
    );
  }

}
