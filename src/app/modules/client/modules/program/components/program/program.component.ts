import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/firestore';
import { WebViewComponent } from '../../../../../admin/modules/packages/components/webview/webview.component';
import { ProgramService } from './program.service';
import { QuestionsComponent } from '../../../../../shared/components/questions/questions.component';

import { StorageService } from '../../../../../../services/auth/storage.service';

import { User } from '../../../../../../models/user/user.model';
import { Step } from '../../../../../../models/packages/step.model';
import { Types } from '../../../../../../models/types/types.model';

import * as moment from 'moment';

@Component({
  selector: 'app-client-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css'],
})

export class ProgramComponent implements OnInit {

  public type: Types;
  public user: User;
  public loadingClientType: boolean;
  public loadingContent: boolean;
  public workout: any;
  public end: boolean;
  public days: number;
  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
  @ViewChild(QuestionsComponent, {static: false}) questionsRef: QuestionsComponent;
  @ViewChild(WebViewComponent, {static: false}) webview: WebViewComponent;

  public section: string;

  public slides: any[];
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4, 'dots': true, 'arrows': true, centerMode: false };
  public articles: any[];
  public article: any[];

  public tab: string;
  public slidesRecp: any[];

  public food: any[];
  constructor(
    public _storageService: StorageService,
    public _programService: ProgramService,
    public _route: ActivatedRoute,
    public _router: Router,
    private _sanitizer: DomSanitizer,
    private _firestore: AngularFirestore
  ) {
    this.loadingContent = false;
    this.type = new Types;
    this.type.image = '';
    this.workout = [];
    this.section = 'daily-workout';
    this.slides = [];
    this.articles = [];
    this.article = [];
    this.tab = null;
    this.food = [];
    this.slidesRecp = [];
  }

  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();

    // Cambia status de cliente a ocupado
    this._firestore.collection('users').doc(this.user.firestore_uid).set({
      status: 2
    }, {
        merge: true
      });

    this._route.params.subscribe(params => {
      this.type.id = params['type'];
      this.section = params['section'];
      this.tab = params['tab'];
    //   alert(this.type.id);
    //   alert(this.section);
    //   alert(this.tab);
      if (this.type.id !== undefined) {
        this.getClientType(this.type.id);
      }



      if (this.section !== 'nutrition-program') {


        if (this.section === 'daily-workout') {
          this.getWorkoutToday(this.type.id);
        }

        if (this.section === 'all-workout') {
          this.getAllWorkouts();
        }


        if (this.section === 'article') {
          this.getArticle(params['article']);
        }
      } else {
        this.getFoodByCategoryAndType(1, this.type.id, 'brakefast');
        this.getFoodByCategoryAndType(2, this.type.id, 'snack_one');
        this.getFoodByCategoryAndType(3, this.type.id, 'lunch');
        this.getFoodByCategoryAndType(4, this.type.id, 'snack_two');
        this.getFoodByCategoryAndType(5, this.type.id, 'dinner');
        this.getFoodByCategoryAndType(6, this.type.id, 'desert');

        if (this.tab === 'article') {
          this.getArticle(params['article']);
        }

        if (this.tab === 'recipes') {
          this.getRecipes(this.type.id);
        }



        if (this.tab === 'articles') {
          this.getAllArticles(this.type.id);
        }


      }

    });

  }





  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }




  getClientType(id) {
    this.loadingClientType = true;
    this._programService.getClientType(id).subscribe(
      data => {
        this.type = data;
        if (this.section !== 'nutrition-program') {
          this.getWorkoutToday(id);
        }
        this.loadingClientType = false;
      }
    );
  }

  getAllWorkouts() {
    this.loadingContent = true;
    this._programService.getAllWorkouts().subscribe(
      data => {
        this.slides = data;
        console.log(data);
      }
    );
  }


  getRecipes(type) {
    this.loadingContent = true;
    this._programService.getRecipes(type).subscribe(
      data => {
        this.slidesRecp = data;
        console.log(data);
      }
    );
  }


  getFoodByCategoryAndType(category, type, node) {
    this.loadingContent = true;
    this._programService.getFoodByCategoryAndType(category, type).subscribe(
      data => {
        console.log(data);
        this.food[node] = data;
        this.loadingContent = false;
      }
    );
  }


  getArticle(article) {
    this.loadingContent = true;
    this._programService.getArticle(article).subscribe(
      data => {
        this.article = data;
        console.log(data);
      }
    );
  }


  getAllArticles(id) {
    this._programService.getAllArticles(id).subscribe(
      data => {
        this.articles = data;
      }
    );
  }




  diffDateStart(init, end) {
    const start = moment(init, 'YYYY-MM-DD');
    const now = moment(end, 'YYYY-MM-DD');
    return moment.duration(start.diff(now)).asDays() + 1;
  }

  safeImageUrl(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  getWorkoutToday(id) {
    this.loadingContent = true;
    this._programService.getWorkoutToday(id).subscribe(
      data => {
        console.log(data);
        this.workout = data.workout;
        this.days = this.diffDateStart(data.client_type.start_date, data.now.date);
        this.loadingContent = false;
      }
    );
  }





  // startStep(item) {
  //   this.loadingPackage = true;
  //   this._programService.startStepOfProgram(item.progress.id, item.step).subscribe(
  //     data => {
  //       this.loadingPackage = false;
  //       //this.getContentByCategory(this.id);
  //     }
  //   )
  // }

  finishStep(item) {
    this.loadingContent = true;
    this._programService.finishStepOfProgram(item).subscribe(
      data => {
        this.getWorkoutToday(this.type.id);
      }
    );
  }

  // restartTheProgram(item) {
  //   this.loadingPackage = true;
  //   this._programService.restartProgram(this.client_type.id).subscribe(
  //     data => {
  //       this._storageService.refreshUserData();
  //       this.getContentByCategory(this.id);
  //     }
  //   )
  // }


  /**
   * Obtiene contenido del paquete
   *
   * @return void
   */
  // public listContentPackage(): void {
  //   this.loadingPackage = true;
  //   this.listSteps = [];
  //   this._programService.getContentByClientType().subscribe(
  //     data => {
  //       this.loadingPackage = false;
  //       this.listSteps = data;
  //     }
  //   )
  // }


  /**
   * Obtiene contenido del paquete
   *
   * @return void
   */
  // public getContentByCategory(category: number): void {
  //   this.loadingPackage = true;
  //   this.modalRef.hide();
  //   this.listSteps = [];
  //   this._programService.getContentByCategory(category).subscribe(
  //     (data) => {
  //       console.log(data);
  //       this.loadingPackage = false;
  //       this.client_type = data.type;
  //       this.steps = data.item;
  //
  //
  //
  //       if (this.steps != null) {
  //         if (moment().valueOf() > moment(this.steps.progress.end_date).valueOf()) {
  //           this.end = true;
  //         } else {
  //           this.end = false;
  //         }
  //         if (this.steps.progress.status == 0) {
  //           this.startStep(this.steps);
  //         }
  //       }
  //
  //
  //     }
  //   )
  // }
}
