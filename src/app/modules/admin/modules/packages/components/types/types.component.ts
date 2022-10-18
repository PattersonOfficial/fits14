import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TypesService } from './types.service';
import { PackagesService } from '../packages/packages.service';

import { Memberships } from "../../../../../../models/memberships/memberships.model";
import { Categories } from "../../../../../../models/categories/categories.model";
import { Types } from "../../../../../../models/types/types.model";
import { Questions } from "../../../../../../models/questions/questions.model";
import { Responses } from "../../../../../../models/questions/responses.model"


@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit {

  public types: Types[];
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions;
  public isModalTypes: boolean = false;
  public isModalProgram: boolean = false;
  public type: Types;
  public memberships: Memberships;
  public questions: Questions[];
  public responses: Responses[];
  public questionSelected: Questions;
  public responseSelected: Responses;
  public item: Types;
  public categories: Categories;

  public loadingBuilder: boolean;
  public video: File[];
  public image: File[];
  public videoToFormData: FormData;
  public imageToFormData: FormData;

  public category__: number;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    public _typesService: TypesService,
    public _packagesService: PackagesService,
    public _route: ActivatedRoute,
    public _router: Router
  ) {
    this.item = new Types();
    this.type = new Types();
    this.video = [];
    this.image = [];
    this.loadingBuilder = false;
    this.category__ = 0;
    this.questionSelected = new Questions;
    this.responseSelected = new Responses;
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": " "
      }
    };

    this._route.params.subscribe(params => {
      this.category__ = params['category'];
      // console.log(this.category__);
    });


    this.listTypes(this.category__);
    this.listMemberships();
    this.listCategories();


  }


  /**
   * Obtiene lista de membresias
   *
   * @return void
   */
  public listMemberships(): void {
    this._packagesService.getMemberships().subscribe(
      (data: Memberships) => {
        this.memberships = data;
      }
    )
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
    )
  }

  /**
   * Obtiene lista de preguntas asociadas a membresia
   *
   * @return void
   */
  public listQuestionsOfCategory(type: Types): void {
    this._typesService.listQuestionsOfCategory(type).subscribe(
      (data: Questions[]) => {
        this.questions = data;
        this.questionSelected = new Questions;
        this.responseSelected = new Responses;
      }
    )
  }


  public getResponsesOfQuestion(): void {
    this.responses = this.questionSelected.responses;
  }


  /**
   * Obtiene lista de contenidos de paquete
   *
   * @return void
   */
  public listTypes(category): void {
    this._typesService.getTypesByCategory(category).subscribe(
      data => {
        this.types = data;
        // console.log(data);
        this.dtTrigger.next();
      }
    )
  }


  /**
   * Obtiene lista de contenidos de paquete
   *
   * @return void
   */
  public trashType(type: Types): void {
    this._typesService.trashType(type).subscribe(
      data => {
        this.destroyDtInstance();
        this.listTypes(this.category__);
      }
    )
  }


  insertNewQuestion() {
    this.item.program.push({
      question: this.questionSelected,
      response: this.responseSelected
    });

    this.item.program = [...this.item.program];
    this.questionSelected = new Questions;
    this.responseSelected = new Responses;
  }


  /**
   * Destruye instancia activa DataTables
   *
   * @return void
   */
  public destroyDtInstance(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      dtInstance.destroy();
    });
  }



  /**
   * Abre modal de configuración de Tipos
   *
   * @param  pack   Objecto de la lista de categorias a editar
   * @return void
   */
  public openModalTypes(item): void {
    this.type.id = item.id;
    this.type.name = item.name;
    this.type.image = item.image;
    this.type.video = item.video;
    this.type.mode_head = item.mode_head;
    this.type.membership = item.membership || {};
    this.type.category = item.category || {};
    this.isModalTypes = true;
  }


  public changeComboImageDropFile() {
    this.loadingBuilder = true;
    setTimeout(() => {
      this.uploadImage();
    }, 2000);
  }

  public changeComboVideoDropFile() {
    this.loadingBuilder = true;
    setTimeout(() => {
      this.uploadVideo();
    }, 2000);
  }

  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadImage() {
    this.loadingBuilder = true;
    this._typesService.uploadFiles(this.imageToFormData).subscribe(
      upload => {
        if (upload instanceof HttpResponse) {
          this.type.image = upload.body[0].public_url;
          this.loadingBuilder = false;
        }
      }
    );
  }

  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadVideo() {
    this._typesService.uploadFiles(this.videoToFormData).subscribe(
      upload => {
        if (upload instanceof HttpResponse) {
          this.type.video = upload.body[0].public_url;
          this.loadingBuilder = false;
        }
      }
    );
  }



  public openModalProgram(item: Types): void {
    this.item = item;
    this.questionSelected = new Questions;
    this.responseSelected = new Responses;
    this.listQuestionsOfCategory(item);
    this.isModalProgram = true;
  }






  /**
   * Oculta modal de edición de Tipos
   *
   * @return void
   */
  public hideModalTypes(): void {
    this.isModalTypes = false;
  }

  public hideModalProgram(): void {
    this.questionSelected = new Questions;
    this.responseSelected = new Responses;
    this.isModalProgram = false;
  }



  /**
   * Elimina respuesta de trama
   *
   * @return void
   */
  public delQuestion(item) {
    if (item.id != null) {
      this._typesService.delQuestion(item).subscribe(
        data => {
          this.item.program.splice(this.item.program.indexOf(item), 1);
        }
      )
    } else {
      this.item.program.splice(this.item.program.indexOf(item), 1);
    }

  }

  /**
   * Guarda categoría
   *
   * @return void
   */
  public saveType() {
    if (this.type.id == null) {
      this._typesService.postType(this.type).subscribe(
        data => {
          this.destroyDtInstance();
          this.listTypes(this.category__);
          this.hideModalTypes();
        }
      )
    } else {
      this._typesService.putType(this.type).subscribe(
        data => {
          this.destroyDtInstance();
          this.listTypes(this.category__);
          this.hideModalTypes();
        }
      )
    }
  }

  /**
   * Guarda programa
   *
   * @return void
   */
  public saveProgram() {
    this._typesService.saveProgram(this.item).subscribe(
      data => {
        this.destroyDtInstance();
        this.listTypes(this.category__);
        this.hideModalProgram();
      }
    )
  }



}
