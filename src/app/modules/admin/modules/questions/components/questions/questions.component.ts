import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { QuestionsService } from './questions.service';
import { PackagesService } from '../../../packages/components/packages/packages.service';

import { Global } from '../../../../../../app.global';
import { Questions } from "../../../../../../models/questions/questions.model";
import { Categories } from "../../../../../../models/categories/categories.model";
import { Responses } from "../../../../../../models/questions/responses.model";
import { Memberships } from "../../../../../../models/memberships/memberships.model";


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  public item: Questions;
  public custom: Responses;
  public isMultiValue: any[];
  public questions: Questions[];
  public dtTrigger: Subject<any> = new Subject();
  public isModalQuestions: boolean = false;
  public isModalResponses: boolean = false;
  public dtOptions;
  public memberships: any;
  public categories: Categories;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    public _questionsService: QuestionsService,
    public _packagesService: PackagesService,
    public _route: ActivatedRoute,
    public _router: Router
  ) {
    this.item = new Questions;
    this.custom = new Responses;
    this.isMultiValue = ['radio', 'checkbox', 'select', 'number_with_select', 'checkbox_with_image'];
  }

  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": " "
      }
    };
    this.listQuestions();
    this.listMemberships();
    this.listCategories();
  }


  /**
   * Obtiene lista de preguntas
   *
   * @return void
   */
  public listQuestions(): void {
    this._questionsService.listQuestions().subscribe(
      data => {
        this.questions = data;
        this.dtTrigger.next();
      }
    );
  }


  /**
   * Obtiene lista de membresias
   *
   * @return void
   */
  public listCategories(): void {
    this._packagesService.getCategories().subscribe(
      (data: Categories) => {
        this.categories = data;
      }
    );
  }


  /**
   * Obtiene lista de membresias
   *
   * @return void
   */
  public listMemberships(): void {
    this._packagesService.getMemberships().subscribe(
      (data: Array<Memberships>) => {
        this.memberships = [...data, {id: 0, title: "All Memberships", price: "0.00"}];
      }
    );
  }



  /**
   * Abre modal de configuración de preguntas
   *
   * @param  pack   Objecto de la lista de preguntas a editar
   * @return void
   */
  public openModalQuestions(question): void {
    this.item.id = question.id;
    this.item.question = question.question;
    this.item.description = question.description;
    this.item.type = question.type || '';
    this.item.name = question.name || '';
    this.item.icon = question.icon || 'playlist_add';
    this.item.membership = question.membership || new Memberships;
    this.item.category = question.category || new Categories;
    this.isModalQuestions = true;
  }


  /**
   * Abre modal de configuración de preguntas
   *
   * @param  pack   Objecto de la lista de preguntas a editar
   * @return void
   */
  public openModalResponses(question): void {
    this.item.id = question.id;
    this.item.question = question.question;
    this.item.description = question.description;
    this.item.type = question.type || '';
    this.item.name = question.name || '';
    this.item.icon = question.icon || 'playlist_add';
    this.item.membership = question.membership || new Memberships;
    this.item.responses = question.responses || [];
    this.isModalResponses = true;
  }


  /**
   * Oculta modal de edición de preguntas
   *
   * @return void
   */
  public hideModalQuestions(): void {
    this.isModalQuestions = false;
  }

  /**
   * Oculta modal de edición de respuestas
   *
   * @return void
   */
  public hideModalResponses(): void {
    this.isModalResponses = false;
  }

  /**
   * Inserta nueva pregunta a trama de item
   *
   * @return void
   */
  public insertNewAnswer(): void {
    if (this.custom.label != null && this.custom.value != null) {
      this.custom.question_id = this.item.id;
      this.item.responses.push(this.custom);
      this.item.responses = [...this.item.responses];
      this.custom = new Responses;
    }
  }


  /**
   * Guarda Pregunta
   *
   * @return void
   */
  public saveQuestion() {
    if (this.item.id == null) {
      this._questionsService.postQuestion(this.item).subscribe(
        data => {
          this.destroyDtInstance();
          this.listQuestions();
          this.hideModalQuestions();
        }
      );
    } else {
      this._questionsService.putQuestion(this.item).subscribe(
        data => {
          this.destroyDtInstance();
          this.listQuestions();
          this.hideModalQuestions();
        }
      );
    }

  }


  /**
   * Guarda respuestas de pregunta
   *
   * @return void
   */
  public saveAnswers() {
    this._questionsService.postAnswers(this.item.responses).subscribe(
      data => {
        this.destroyDtInstance();
        this.listQuestions();
        this.hideModalResponses();
      }
    );
  }


  /**
   * Elimina respuesta de trama
   *
   * @return void
   */
  public delAnswer(item) {
    if (item.id != null) {
      this._questionsService.delAnswers(item).subscribe(
        data => {
          this.item.responses.splice(this.item.responses.indexOf(item), 1);
        }
      )
    } else {
      this.item.responses.splice(this.item.responses.indexOf(item), 1);
    }

  }

  public trashQuestion(question: Questions): void {
    this._questionsService.trashQuestion(question).subscribe(
      data => {
        this.destroyDtInstance();
        this.listQuestions();
      }
    )
  }
  public upload(file) {
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(file[0]);
  }

  public handleReaderLoaded(e) {
    this.item.responses[this.item.responses.indexOf(this.custom)]['image'] = 'data:image/png;base64,' + btoa(e.target.result);
    this.custom = new Responses;
  }

  public loadImage(item: Responses, file) {
    this.custom = item;
    file.click();
  }

  public destroyDtInstance(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      dtInstance.destroy();
    });
  }

}
