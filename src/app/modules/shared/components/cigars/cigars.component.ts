import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';

import { CigarsService } from "./cigars.service";
import { StorageService } from "../../../../services/auth/storage.service";

import { CigarsWidget } from "../../../../models/widgets/cigars/cigars.model";
import { User } from "../../../../models/user/user.model";

declare var jQuery: any;

@Component({
  selector: 'app-client-cigars',
  templateUrl: './cigars.component.html',
  styleUrls: ['./cigars.component.css']
})

export class CigarsComponent {

  public loadingBox: boolean;
  public loadingBoxModal: boolean;
  public dataReport: any[];
  public colorSets: any;
  public colorScheme: any;
  public ref: any[];
  public isVisibleIntro: boolean;
  public isVisibleInput: boolean;
  public smoke: CigarsWidget;
  public user: User
  public smokeToday: number;
  public initConfigure: boolean;
  public verifyDamage: boolean;

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
    public _cigarsService: CigarsService,
    public _storageService: StorageService,
  ) {
    this.smoke = new CigarsWidget;
    this.smoke.cigars = 1;
    this.dataReport = [];
    this.loadingBox = false;
    this.loadingBoxModal = false;
    this.isVisibleIntro = true;
    this.isVisibleInput = false;
    this.verifyDamage = false;
    this.smokeToday = 0;
    Object.assign(this, {
      colorSets
    });

    this.setColorScheme('solar');
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();


    this._storageService.isUserChanged.subscribe((user) => {
      this.user = user;
    });

    this.getSmokeToday();
  }


  setCigars() {
    this.smoke.cigars++;
  }

  delCigars() {
    if (this.smoke.cigars > 0) {
      this.smoke.cigars--;
    }
  }


  getSmokeToday() {
    this.loadingBox = true;
    this.verifyDamage = true;
    this._cigarsService.getSmokeToday().subscribe(
      (smoke) => {
        this.loadingBox = false;
        if (smoke != null) {
          this.smokeToday = smoke.cigars;
        }
        this.calculateDamage(this.smokeToday);
      }
    )
  }

  saveCigars() {
    this.loadingBox = true;
    this._cigarsService.saveCigars(this.smoke).subscribe(
      () => {
        this.loadingBox = false;
        this.smoke.cigars = 0;
        this.getSmokeToday();
      }
    )
  }



  getReportLastWeek() {
    this.loadingBoxModal = true;
    this._cigarsService.getLogSmoke().subscribe(
      data => {
        this.loadingBoxModal = false;
        this.dataReport = data;
      }
    )
  }


  calculateDamage(cigars) {
    if (cigars >= 1) {
      jQuery('#el_48sF01R0BH').css('fill', '#8c8c8c');
      jQuery('#el_m6Smo6c3v6h').css('fill', '#8c8c8c');
    }

    if (cigars >= 3) {
      jQuery('#el__wVHKiTmwTv').css('fill', '#616161');
      jQuery('#el_7l_267i_VZp').css('fill', '#8c8c8c');
    }

    if (cigars >= 5) {
      jQuery('#el_aH8_ecYIzZ').css('fill', '#8e8e8e');
      jQuery('#el_RT9b3JLU9bG').css('fill', '#9e9e9e');
    }


    if (cigars >= 10) {
      jQuery('#el_xpYbaJEw72').css('fill', '#565656');
      jQuery('#el_LpnAQzFNe8S').css('fill', '#565656');
    }

    if (cigars >= 15) {
      jQuery('#el_YFp6g-jPcS').css('fill', '#7b7b7b');
      jQuery('#el_4DhwV_AVZA').css('fill', '#848484');
    }

    if (cigars >= 20) {
      jQuery('#el_LpnAQzFNe8S').css('fill', '#9e9e9e');
      jQuery('#el_QOh6AJ0aLhG').css('fill', '#a7a7a7');

      jQuery('#el_AFJ4xm20LY').css('fill', '#464646');
      jQuery('#el_FvJadl6GRW').css('fill', '#525252');

      jQuery('#el_XEWOOP6tjz0').css('fill', '#5f5f5f');
      jQuery('#el_bvE6yYKazP').css('fill', '#717171');

      jQuery('#el_Xs__96Nw_Up').css('fill', '#545454');
      jQuery('#el_cvYZ9L4Pb7').css('fill', '#313131');

      jQuery('#el_i9lHMN4j_f').css('fill', '#909090');
      jQuery('#el_ZB77XMpNkyR').css('fill', '#464646');
      jQuery('#el_HsAvHiq2rBz').css('fill', '#505050');
    }

    this.verifyDamage = false;
  }


  setColorScheme(name) {
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }

  openLogWeek() {
    this.modalRef.show();
    this.getReportLastWeek();
  }

}
