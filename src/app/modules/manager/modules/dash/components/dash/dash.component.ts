import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Chart, ChartData, Point } from 'chart.js';

import { User } from '../../../../../../models/user/user.model';
import { StorageService } from "../../../../../../services/auth/storage.service";
import { DashService } from "./dash.service";


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-manager-dash',
  templateUrl: './dash.component.html'
})


export class DashComponent {
  public user: User;
  public childs: any[];


  constructor(
    public _dashService: DashService,
    public _storageService: StorageService,
  ) {

  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    this._storageService.isUserChanged
      .subscribe(
        (user) => this.user = user
      );

    this.getUser(this.user.id);
  }

  getUser(id: string) {
    this._dashService.getUser(id).subscribe(
      data => {
        this.childs = data.childs;
      }
    );
  }

}
