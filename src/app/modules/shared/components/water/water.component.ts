import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// -------------Services-----------------
import { StorageService } from '../../../../services/auth/storage.service';
import { WaterService } from './water.service';
// -------------Models-----------------
import { WaterWidget } from '../../../../models/widgets/water/water.model';
import { User } from '../../../../models/user/user.model';
import { colorSets } from '@swimlane/ngx-charts';


declare var jQuery: any;

@Component({
  selector: 'app-client-water',
  templateUrl: './water-new.component.html',
  // templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})

export class WaterComponent implements OnInit {

  public loadingBox: boolean;
  public loadingBoxModal: boolean;
  public dataReport: any[];
  public colorSets: any;
  public colorScheme: any;
  public ref: any[] = [];
  public isVisibleIntro: boolean;
  public isVisibleInput: boolean;
  public water: WaterWidget;
  public user: User | any;
  public recommended: number = 0;
  public recommendedInLog: number | undefined;
  public ingested: number;
  public last: number;
  public measurement: string | undefined;
  public measurementInLog: string | undefined;
  public typeBottle: any[];
  public initConfigure: boolean;
  public isValid: boolean;
  public step: number;
  public infoExtraForm: FormGroup | any;

  public bottle_cup: number | undefined;
  public bottle_small: number | undefined;
  public bottle_large: number | undefined;

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective | any;

  constructor(
    public _waterService: WaterService,
    public _storageService: StorageService,
    private _formBuilder: FormBuilder,
  ) {
    this.water = new WaterWidget;
    this.dataReport = [];
    this.loadingBox = false;
    this.loadingBoxModal = false;
    this.isVisibleIntro = true;
    this.isVisibleInput = false;
    this.ingested = 0;
    this.last = 0;
    this.typeBottle = [];
    this.initConfigure = false;
    this.isValid = false;
    this.step = 1;

    Object.assign(this, {
      colorSets
    });

    this.setColorScheme('air');
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    this.measurement = this.user.client.measurement_liquid;
    this.measurementInLog = this.measurement;

    this.infoExtraForm = this._formBuilder.group({
      weight: [this.user.client.weight, Validators.required],
      measurement_weight: [this.user.client.measurement_weight, Validators.required],
      measurement_liquid: [this.user.client.measurement_liquid, Validators.required]
    });


    this._storageService.isUserChanged.subscribe((user) => {
      this.user = user;
      this.measurement = this.user.client.measurement_liquid;
      this.measurementInLog = this.measurement;
      this.checkConfiguration();
    });
    this.getIngestedToday(this.measurement);
    this.checkConfiguration();
  }

  openFormInput() {
    this.isVisibleIntro = false;
    this.isVisibleInput = true;
  }

  checkConfiguration() {
    if ((this.user.client.weight == null)
        || (this.user.client.weight < 5)
        || (this.user.client.measurement_weight == null)
        || (this.user.client.measurement_liquid == null)) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  openSettings() {
    this.initConfigure = true;
    this.isVisibleInput = false;
  }

  cancelIngested() {
    this.isVisibleIntro = true;
    this.isVisibleInput = false;
  }

  nextStep() {
    this.step++;
  }

  lastStep() {
    if (this.step == 1) {
      this.initConfigure = false;
      this.getIngestedToday(this.measurement);
    } else {
      this.step--;
    }
  }

  onSubmitInfoExtra() {
    this.loadingBox = true;
    if (this.infoExtraForm.invalid) {
      this.loadingBox = false;
      return;
    }

    this._waterService.saveInfoExtraClient(this.infoExtraForm.value).subscribe(
      () => {
        this.loadingBox = false;
        this.isVisibleIntro = true;
        this.isValid = true;
        this.initConfigure = false;
        this._storageService.refreshUserData();
        setTimeout(() => {
          this.getIngestedToday(this.measurement);
          this.typeBottle = [];
        }, 600);
      }
    );
  }

  setQuantyOfType(event: any, type: any, mililiters: any) {
    if (event.currentTarget.checked) {
      if (this.typeBottle.indexOf(type) == -1) {
        this.typeBottle.push(type);
        this.typeBottle = [...this.typeBottle];
      }
      this.last += mililiters;
    } else {
      if (this.last > 0) {
        this.last -= mililiters;
      }
      this.typeBottle.splice(this.typeBottle.indexOf(type), 1);
      this.typeBottle = [...this.typeBottle];
    }
  }


  calculateRange(quanty: any) {
    const real = (quanty * 100) / this.recommended;
    const ml = (220 * real) / 100;
    let apply = 220 - ml;
    this.ingested = quanty;
    if (ml > 220) {
      apply = 0;
    }
    // jQuery('#waterBrush').velocity({ translateY: [`${apply.toFixed(0)}px`, 220] }, { duration: 2000, 'easing': 'easeOutBack' });
  }

  reportInOunces(event: any) {
    if (event.currentTarget.checked) {
      this.measurementInLog = 'oz';
      this.recommendedInLog = this.calculateFeee(this.user.client.weight, 'oz');
      this.getReportLastWeek(this.measurementInLog);
    } else {
      this.measurementInLog = 'ml';
      this.recommendedInLog = this.calculateFeee(this.user.client.weight, 'ml');
      this.getReportLastWeek(this.measurementInLog);
    }
  }

  saveWaterToday() {
    if (this.ingested) {
      this.water.ml = this.ingested;
      this.water.oz = Math.ceil(this.ingested * 0.033814);
      this._waterService.postIngestedToday(this.water).subscribe(
        data => {
          this.ingested = 0;
          setTimeout(() => {
            this.getIngestedToday(this.measurement);
          }, 600);
        }
      );
    }
  }

  saveIngested() {
    if (this.last > 0) {
      this.loadingBox = true;

      if (this.measurement == 'ml') {
        this.water.ml = this.last;
        this.water.oz = Math.ceil(this.last * 0.033814);
      } else {
        this.water.oz = this.last;
        this.water.ml = Math.ceil(this.last * 29.5735);
      }

      jQuery('#waterBrush').velocity({ translateY: [`220px`, 220] }, { duration: 2000, 'easing': 'easeOutBack' });
      this._waterService.postIngestedToday(this.water).subscribe(
        () => {
          this.loadingBox = false;
          this.isVisibleIntro = true;
          this.isVisibleInput = false;
          this.last = 0;
          this.ingested = 0;
          setTimeout(() => {
            this.getIngestedToday(this.measurement);
            this.typeBottle = [];
            this.typeBottle = [...this.typeBottle];
          }, 600);
        }
      )
    }
  }


  getReportLastWeek(measurement: any) {
    this.loadingBoxModal = true;
    this._waterService.getLogWater(measurement).subscribe(
      data => {
        this.loadingBoxModal = false;
        this.dataReport = data;
      }
    );
  }

  getIngestedToday(measure: any) {
    this._waterService.getIngested().subscribe(
      data => {
        this.recommended = this.calculateFeee(this.user.client.weight, this.user.client.measurement_liquid);
        this.recommendedInLog = this.recommended;
        this.calculateRange(data.ingested[measure]);
        this.changeCups();
      }
    );
  }

  changeCups() {
    if (this.user.client.measurement_liquid == 'oz') {
      this.bottle_cup = Math.ceil(200 * 0.033814);
      this.bottle_small = Math.ceil(500 * 0.033814);
      this.bottle_large = Math.ceil(1500 * 0.033814);
    } else {
      this.bottle_cup = 200;
      this.bottle_small = 500;
      this.bottle_large = 1500;
    }
  }

  calculateFeee(weight: any, measure: any) {
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
    let ml = Math.ceil((Math.ceil(kg) * 30) + extra);
    if (measure == 'oz') {
      return Math.ceil(ml * 0.033814);
    } else {
      return ml;
    }
  }

  setColorScheme(name: any) {
    this.colorScheme = this.colorSets.find((s: any) => s.name === name);
  }

  openLogWeek() {
    this.modalRef.show();
    this.getReportLastWeek(this.measurement);
  }

  changeSliderIngested(event: any) {
    this.ingested = event.from;
  }

}
