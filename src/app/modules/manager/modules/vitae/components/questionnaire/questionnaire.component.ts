import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { QuestionnaireService } from './questionnaire.service';
import { StorageService } from '../../../../../../services/auth/storage.service';
import { User } from '../../../../../../models/user/user.model';


@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
})

export class QuestionnaireComponent implements OnInit {

  public user: User;
  public questions: any[];

  @Input() public uid: number;
  @Input() public client_id: number;

  constructor(
    public _storageService: StorageService,
    public _questionnaireService: QuestionnaireService,
  ) {

  }

  ngOnInit() {
    this.getQuestions(this.client_id);
  }


  getQuestions(id) {
    this._questionnaireService.getQuestionAndResponses(id).subscribe(
      data => {

        console.log(data);
        this.questions = data;
      }
    );
  }


}
