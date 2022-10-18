import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Chart, ChartData, Point } from 'chart.js';


import { QuestionnaireComponent } from '../../../vitae/components/questionnaire/questionnaire.component';

import { User } from '../../../../../../models/user/user.model';
import { StorageService } from "../../../../../../services/auth/storage.service";
import { VitaeService } from "./vitae.service";

@Component({
  selector: 'app-manager-vitae',
  templateUrl: './vitae.component.html'
})


export class VitaeComponent {
  public user: User;
  public childs: any[];
  public tab: string;

  @ViewChild(QuestionnaireComponent, {static: false}) QuestionnaireComponentRef: QuestionnaireComponent;

  constructor(
    public _vitaeService: VitaeService,
    public _storageService: StorageService,
    public _route: ActivatedRoute,
    public _router: Router
  ) {
    this.user = new User;
    this.tab = 'questionnaire'
  }

  ngOnInit() {

    this._route.params.subscribe(params => {
      console.log(params['id']);
      this.getUser(params['id']);
    });

  }

  getUser(id: string) {
    this._vitaeService.getUser(id).subscribe(
      data => {
        this.user = data;
        this.QuestionnaireComponentRef.getQuestions(this.user.client.id);
        console.log(data);
      }
    );
  }

}
