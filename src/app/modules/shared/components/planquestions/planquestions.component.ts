import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PlanQuestionsService } from './planquestions.service';
import { User } from '../../../../models/user/user.model';
import { StorageService } from "../../../../services/auth/storage.service";
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-client-planquestions',
  templateUrl: './planquestions.component.html',
  styleUrls: ['./planquestions.component.css'],
})

export class PlanQuestionsComponent {

  public loadingQuestions: boolean;
  public user: User;
  public questions: any[] = [];
  public question: number;
  public totalQuestions: number | any;
  public porcent: number;
  public next: boolean;
  public previous: boolean;
  public formFields: any[] = [];
  public questionFields: any[] =[];
  public questionForm: FormGroup | any;
  public message: string;
  public formNuts: boolean;
  public weight: number | any;
  public height: number | any;
  public meWeight: string = '';
  public meHeight: string = '';
  public measurements: string = '';
  public conditions: boolean = false;

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective | any;

  constructor(
    private _formBuilder: FormBuilder,
    public _storageService: StorageService,
    public _planquestionsService: PlanQuestionsService,
    // public dialogRef: MatDialogRef<PlanQuestionsComponent>,
  ) {
    this.question = 0;
    this.porcent = 0;
    this.user = new User();
    this.next = false;
    this.formNuts = false;
    this.previous = false;
    this.loadingQuestions = false;
    this.message = "Please wait, we process your information";
    this.measurements = "metric";
  }

  ngOnInit() {
    if (this._storageService.isAuthenticated()) {
      this.user = this._storageService.getCurrentUser();
      this._storageService.isUserChanged
        .subscribe((user) => this.user = user);
      /*this.getQuestionsOfMembership();*/
    }

    if (this.user.client.membership.id == 2 || this.user.client.membership.id == 3 || this.user.client.membership.id == 1) {
      this.formNuts = true;
      this.question = 0;
      this.totalQuestions = 9;
    } else {
      this.formNuts = false;
    }

    this.meWeight = 'kg';
    this.meHeight = 'cm';
    this.height = this.user.client['height'];
    this.weight = this.user.client.weight;



    // console.log(this.user);
  }

  openModalQuestions() {
    jQuery('#right-sidebar').toggleClass('hiding');
    this.modalRef.show();
  }

  questionModelClose(){
    // this.logout();
    this.modalRef.hide()
  }

  saveMeds() {
    let data = {
      weight: this.weight,
      height: this.height,
      meWeight: this.meWeight,
      meHeight: this.meHeight
    }

    this._planquestionsService.saveMedidas(data).subscribe(
      (response: any) => {
        this.formNuts = false;
        this.getQuestionsOfMembership();
      }
    )
  }

  getQuestionsOfCategory(category: any) {
    this.loadingQuestions = true;
    this.question = 0;
    this.next = false;
    this.previous = false;
    this.porcent = 0;
    this.modalRef.show();
    this._planquestionsService.getQuestionsOfCategory(category).subscribe(
      (questions: any) => {
        this.questions = questions;
        this.questionForm = this.toFormGroup(questions);
        this.totalQuestions = questions.length;
        this.loadingQuestions = false;
      }
    )
  }

  getRandomInt(min: any, max: any) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getQuestionsOfMembership() {
    this.loadingQuestions = true;
    this._planquestionsService.getQuestionsOfMembership().subscribe(
      (questions: any) => {
        //this.modalRef.show();
        // console.log(questions)
        this.questions = questions;
        this.questionForm = this.toFormGroup(questions);
        this.totalQuestions = questions.length+1;
        this.loadingQuestions = false;
        this.question++
      }
    )
  }

  setResponsesOfUser() {
    this._planquestionsService.setResponsesOfUser(this.questionForm.value).subscribe(
      (data: any) => {
        this._storageService.refreshUserData();
      }
    )
  }

  toFormGroup(questions: any) {
    let group: any = {};
    questions.forEach((question: any) => {
      if (question.type == 'checkbox' || question.type == 'checkbox_with_image') {
        group[question.name] = new FormGroup({});
        question.responses.forEach((response: any) => {
          group[question.name].addControl(response.id, new FormControl(false));
        });
      } else if (question.type == 'number_with_select') {
        group[question.name] = new FormGroup({});
        group[question.name].addControl('select_data', new FormControl(''));
        group[question.name].addControl('val_data', new FormControl(''));
      } else {
        group[question.name] = new FormControl('');
      }
    });
    return new FormGroup(group);
  }

  trueNext() {
    this.next = true;
  }

  nextQuestion() {
    let states = [
      "Searching for matches", "Verifying information", "Found program", "Loading Program"
    ];

    let currentState = 0;
    this.question = (this.question + 1);
    this.porcent = (100 / this.totalQuestions) * this.question;

    if (this.question >= this.totalQuestions) {
      let timerId = setInterval(() => {
        // console.log(states);
        this.message = states[this.getRandomInt(0, 3)];
        currentState += 1;
      }, 2000);

      setTimeout(() => {
        this.setResponsesOfUser();
        clearInterval(timerId);
      }, 8000);

      setTimeout(() => {
        this.modalRef.hide();
        window.location.reload();
      }, 12000);
    }
    this.next = false;

    if (this.question > 0) {
      this.previous = true;
    } else {
      this.previous = false;
    }
  }

  prevQuestion() {
    this.question = (this.question - 1);
    this.porcent = (100 / this.totalQuestions) * this.question;

    this.previous = true;
    this.next = false;

    if (this.question == 0) {
      this.porcent = 30;
      this.previous = false;
    }

  }

  include(e: any) {
    jQuery(e.target)
  }

  public logout(): void {
    this._planquestionsService.logout().subscribe(
      response => {
        if (response) {
          this._storageService.logout();
        }
      },
      error => {
        this._storageService.logout();
      }
    );
  }


}
