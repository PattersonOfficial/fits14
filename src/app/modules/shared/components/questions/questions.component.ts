import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { QuestionsService } from './questions.service';
import { User } from '../../../../models/user/user.model';
import { StorageService } from '../../../../services/auth/storage.service';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-questions',
  templateUrl: './questions-new.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit {
  public loadingQuestions: boolean;
  public user: User;
  public questions: any[];
  public question: number;
  public totalQuestions: number;
  public porcent: number;
  public next: boolean;
  public previous: boolean;
  public formFields: any[];
  public questionFields: any[];
  public questionForm: FormGroup;
  public message: string;
  public formNuts: boolean;
  public weight: number;
  public height: number;
  public meWeight: string;
  public meHeight: string;
  public measurements: string;
  public conditions: boolean;

  // ----------------------------
  public userAnswers: any[];
  public selectedDailyRoutine = '';
  public selectedFitness = '';
  public selectedGoals = '';
  public targetUserWeight: number;
  public userAge: number;
  public userHeight: number;
  public userWeight: number;
  public selectedBodyType = '';
  public selectedHabits = [];
  public selectedDietaryRestrictions = [];
  public selectedFoodGroats = [];
  public selectedFoodOptions = [];
  public selectedFoodMeat = [];
  public selectedCatching = '';
  public selectedHydration = '';
  public selectedSmoking = '';

  public response: any;
  public userResp: any;

  public userResponses: any = [];
  public totalMembershipQuestions = 0;

  @ViewChild('modalRef', { static: false }) modalRef: ModalDirective;

  constructor(
    private _formBuilder: FormBuilder,
    public _storageService: StorageService,
    public _questionsService: QuestionsService,
    public dialogRef: MatDialogRef<QuestionsComponent>,
    private toastr: ToastrService
  ) {
    this.question = 0;
    this.porcent = 0;
    this.user = new User();
    this.next = false;
    this.formNuts = false;
    this.previous = false;
    this.loadingQuestions = false;
    this.message = 'Please wait, we process your information';
    this.measurements = 'metric';
  }

  ngOnInit() {
    if (this._storageService.isAuthenticated()) {
      this.user = this._storageService.getCurrentUser();
      this._storageService.isUserChanged.subscribe(
        (user) => (this.user = user)
      );
      this.getQuestionsOfMembership();
    }

    if (
      this.user.client.membership.id == 2 ||
      this.user.client.membership.id == 3
    ) {
      this.formNuts = true;
      this.question = 0;
      this.totalQuestions = 9;
    } else {
      this.formNuts = false;
    }

    this.meWeight = 'kg';
    this.meHeight = 'cm';

    // console.log(this.user);
    // this._questionsService.loadResponsesOfUser().subscribe(
    //     responses => {
    //       return this.userResp = responses;
    //       console.log('User Responses: ', this.userResp);
    //     }
    // );
  }

  openModalQuestions() {
    jQuery('#right-sidebar').toggleClass('hiding');
    this.modalRef.show();
  }

  questionModelClose() {
    this.logout();
    this.modalRef.hide();
  }

  startedProcess() {
    window['dataLayer'].push({
      event: 'Start The Process',
      start_the_process: 'True',
      pageUrl: window.location.href,
    });
  }

  enteredWeight() {
    window['dataLayer'].push({
      event: 'Weight',
      weight: this.weight,
      pageUrl: window.location.href,
    });
  }

  saveMeds() {
    const data = {
      weight: this.weight,
      target_weight: this.targetUserWeight,
      height: this.height,
      meWeight: this.meWeight,
      meHeight: this.meHeight,
    };

    this._questionsService.saveMedidas(data).subscribe((response: any) => {
      this.formNuts = false;
      this.getQuestionsOfMembership();
    });
  }

  getQuestionsOfCategory(category) {
    this.loadingQuestions = true;
    this.question = 0;
    this.next = false;
    this.previous = false;
    this.porcent = 0;
    this.modalRef.show();
    this._questionsService
      .getQuestionsOfCategory(category)
      .subscribe((questions: any) => {
        this.questions = questions;
        this.questionForm = this.toFormGroup(questions);
        this.totalQuestions = questions.length;
        this.loadingQuestions = false;
      });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getQuestionsOfMembership() {
    this.loadingQuestions = true;
    this._questionsService
      .getQuestionsOfMembership()
      .subscribe((questions: any) => {
        this.totalMembershipQuestions = questions.length + 2;
        //this.modalRef.show();
        // console.log(questions);
        this.questions = questions;
        this.questionForm = this.toFormGroup(questions);
        this.totalQuestions = questions.length + 1;
        this.loadingQuestions = false;
        this.question++;
      });
  }

  setResponsesOfUser() {
    this._questionsService
      .setResponsesOfUser(this.questionForm.value)
      .subscribe((data: any) => {
        this._storageService.refreshUserData();
      });
  }

  toFormGroup(questions) {
    const group: any = {};
    questions.forEach((question) => {
      if (
        question.type == 'checkbox' ||
        question.type == 'checkbox_with_image'
      ) {
        group[question.name] = new FormGroup({});
        question.responses.forEach((response) => {
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
    const states = [
      'Searching for matches',
      'Verifying information',
      'Found program',
      'Loading Program',
    ];

    let currentState = 0;
    this.question = this.question + 1;
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
    this.question = this.question - 1;
    this.porcent = (100 / this.totalQuestions) * this.question;

    this.previous = true;
    this.next = false;

    if (this.question == 0) {
      this.porcent = 30;
      this.previous = false;
    }
  }

  include(e) {
    jQuery(e.target);
  }

  public logout(): void {
    this._questionsService.logout().subscribe(
      (response) => {
        if (response) {
          this._storageService.logout();
        }
      },
      (error) => {
        this._storageService.logout();
      }
    );
  }
  // ------------------------------------------------
  closeDialog(data) {
    this.dialogRef.close(data);
  }

  setResponses(question: any, response: any) {
    if (question.type === 'radio') {
      if (this.userResponses.some((elem) => elem.id === response.id)) {
        return;
      } else {
        this.userResponses = this.userResponses.filter(
          (elem) => elem.question_id !== question.id
        );
        this.userResponses.push(response);
      }
    } else if (question.type === 'checkbox' || 'checkbox_with_image') {
      if (this.userResponses.some((elem) => elem.id === response.id)) {
        this.userResponses = this.userResponses.filter(
          (elem) => elem.id !== response.id
        );
      } else {
        this.userResponses.push(response);
      }
    }
  }

  activeResponse(response_id: number) {
    if (response_id && this.userResponses) {
      return this.userResponses.some((elem) => elem.id === response_id);
    } else {
      return;
    }
  }

  submitUserAnswers() {
    this._questionsService.setResponsesOfUser(this.userResponses).subscribe(
      (data: any) => {
        this._storageService.refreshUserData();
        this.toastr.success('Profile Updated Successfully');
        this.response = data;
        this.closeDialog(true);
      },
      (error) => {
        console.log(error);
        this.toastr.error('rofile update unsuccessful');
      }
    );
  }
}
