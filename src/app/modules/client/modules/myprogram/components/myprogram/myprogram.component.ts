import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TypesComponent } from '../../../../../shared/components/types/types.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/firestore';

import { WebViewComponent } from '../../../../../admin/modules/packages/components/webview/webview.component';
import { MyprogramService } from './myprogram.service';
import { QuestionsComponent } from '../../../../../shared/components/questions/questions.component';

import { StorageService } from '../../../../../../services/auth/storage.service';

import { User } from '../../../../../../models/user/user.model';
import { Types } from '../../../../../../models/types/types.model';

import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ChangePlanComponent } from '../../../../../shared/components/change-plan/change-plan.component';
import { Contents } from '../../../../../../models/contents/contents.model';

declare var jQuery: any;

@Component({
  selector: 'app-client-myprogram',
  templateUrl: './myprogram-new.component.html',
  styleUrls: [
    './myprogram-new.component.css',
    'myprogram-nutrition.component.css'
  ]
})
export class MyprogramComponent implements OnInit, AfterViewInit {
  @ViewChild(TypesComponent, { static: false })
  TypesComponentRef: TypesComponent;
  type: Types;
  user: User;
  loadingClientType: boolean;
  loadingContent: boolean;
  workout: Contents;
  end: boolean;
  days: number;
  singleWorkoutContent: Contents;
  singleRecipeContent: any;
  tempAllArticleArray: any;
  tempAllRecipeArray: any;
  workoutMathWork: any;
  loadingClientTypes: boolean;

  @ViewChild('modalRef', { static: false }) modalRef: ModalDirective;
  @ViewChild(QuestionsComponent, { static: false })
  questionsRef: QuestionsComponent;
  @ViewChild(WebViewComponent, { static: false }) webview: WebViewComponent;

  subsection: string;
  slides: any[];
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: true,
    arrows: true,
    centerMode: false
  };
  articles: any[];
  root_article: any;
  section: string;
  tab: string;
  wellnessSubcategory: number;
  fitnessSubcategory = 777;
  slidesRecp: any[];
  isavailable = false;

  food: any[];
  mySlideImages: any[];
  myCarouselImages: any[];
  mySlideOptions: any;
  myCarouselOptions: any;
  allWorkoutLength: number;
  allArticleLength: number;
  allRecipeLength: number;
  activeBreakfastId = 0;
  activeSnackId = 0;
  activeSnackOnefastId = 0;
  activeLunchfastId = 0;
  activeSnackTwofastId = 0;
  activeDinnerfastId = 0;
  activeDissertfastId = 0;

  activeRecipeId = 0;
  macroNutrientCarbs = 0;
  macroNutrientProteins = 0;
  macroNutrientFats = 0;

  dailyBreakfasts: Contents[] = [];
  dailySnacks: Contents[] = [];
  dailyLunches: Contents[] = [];
  dailyDinners: Contents[] = [];

  workoutRaiting = '4';
  recipeRaiting = '5';
  readMore = '<strong class="read-more"> ...Read More</strong>';
  loadMoreArticles = 2;
  recipesLength = 0;
  allWorkoutsByType: Contents[];
  showWorkoutsByType: Contents[];

  searchWorkoutStr = '';
  filteredWorkouts: Contents[];
  searchRecipeStr = '';
  filteredRecipes: any[] = [];

  dailyWorkoutIsLoaded = false;

  isMobile = false;

  public carouselOptions;

  constructor(
    public _storageService: StorageService,
    public _myprogramService: MyprogramService,
    public _route: ActivatedRoute,
    public _router: Router,
    private _sanitizer: DomSanitizer,
    private _firestore: AngularFirestore,
    public dialog: MatDialog
  ) {
    this.loadingContent = false;
    this.type = new Types();
    this.type.image = '';
    this.workout = null;
    this.section = 'daily-workout';
    this.slides = [];
    this.articles = [];
    this.allWorkoutLength = 0;
    this.allArticleLength = 0;
    this.allRecipeLength = 0;

    this.root_article = {};
    this.subsection = '';
    this.tab = null;
    this.food = [];
    this.slidesRecp = [];
    this.mySlideImages = [];
    this.myCarouselImages = [];
    this.mySlideOptions = {};
    this.myCarouselOptions = {};
    this.singleRecipeContent = {};
    this.tempAllArticleArray = [];
    this.tempAllRecipeArray = [];
    this.workoutMathWork = Math;
    this.loadingClientTypes = false;
  }

  ngOnInit() {
    this.carouselOptions = {
      items: 1,
      autoWidth: true,
      dots: false,
      loop: false,
      nav: true,
      autoplay: false,
      autoplayTimeout: 5000,
      margin: 10
    };

    this.isMobile = this.getIsMobile();

    window.onresize = () => {
      this.isMobile = this.getIsMobile();
    };
    this.user = new User();
    this.user = this._storageService.getCurrentUser();

    this._firestore.collection('users').doc(this.user.firestore_uid).set(
      {
        status: 2
      },
      {
        merge: true
      }
    );

    this.mySlideImages = [1, 2, 3].map(
      i => `https://picsum.photos/640/480?image=${i}`
    );

    this.mySlideOptions = {
      items: 1,
      dots: false,
      stagePadding: 350,
      autoWidth: true,
      center: true,
      loop: true,
      margin: 60
    };

    this.myCarouselOptions = {
      items: 1,
      dots: false,
      stagePadding: 350,
      autoWidth: true,
      center: true,
      loop: true,
      margin: 130
    };

    this._route.params.subscribe(params => {
      this.type.id = params['type'];
      if (this.type.id === 13) {
        this.section = 'yoga';
      }
      this.section = params['section'];
      this.tab = params['tab'];

      if (this.section === 'wellness') {
        switch (this.tab) {
          case 'meditation':
            this.wellnessSubcategory = 8;
            break;
          case 'success':
            this.wellnessSubcategory = 9;
            break;
          case 'smoking':
            this.wellnessSubcategory = 10;
            break;
          case 'sleep':
            this.wellnessSubcategory = 11;
            break;
          case 'yoga':
            this.wellnessSubcategory = 7;
            break;
          default:
            this.wellnessSubcategory = 7;
            break;
        }
      }

      if (this.type.id !== undefined) {
        this.getClientType(this.type.id);
      }

      if (this.section === 'fitness') {
        if (this.tab === 'daily-workout') {
          this.getWorkoutToday(this.type.id, this.fitnessSubcategory);
          this.getAllWorkoutsByType(this.type.id);
          this.getAllArticles(this.type.id);
        }

        if (this.tab === 'all-workout') {
          this.getAllWorkoutsByType(this.type.id);
        }

        if (this.tab === 'single-workout') {
          this.getAllWorkoutsForSingle(+params['contentId']);
          this.getAllWorkoutsByType(this.type.id);
        }

        if (this.tab === 'all-articles') {
          this.getAllArticles(this.type.id);
        }

        if (this.tab === 'article') {
          this.getArticle(params['contentId']);
          this.getAllArticles(this.type.id);
        }
      }

      if (this.section === 'wellness') {
        if (this.tab === 'single-workout') {
          this.getAllWorkoutsForSingle(+params['contentId']);
          this.getAllWorkoutsByType(this.type.id);
        } else {
          this.getWorkoutToday(this.type.id, this.wellnessSubcategory);
          this.getAllWorkoutsByType(this.type.id);
          this.getAllArticles(this.type.id);
        }

        if (this.tab === 'article') {
          this.getArticle(params['contentId']);
          this.getAllArticles(this.type.id);
        }
      }

      if (this.section === 'nutrition-program') {
        if (this.tab === undefined) {
          this.getFoodByCategoryAndType(1, this.type.id);

          this.getRecipes(this.type.id);
          this.getAllArticles(this.type.id);
        }
        if (this.tab === 'daily') {
          this.getFoodByCategoryAndType(1, this.type.id);

          this.getRecipes(this.type.id);
          this.getAllArticles(this.type.id);
        }
        if (this.tab === 'all-articles') {
          this.getAllArticles(this.type.id);
        }
        if (this.tab === 'article') {
          this.getArticle(params['contentId']);
          this.getAllArticles(this.type.id);
        }
        if (this.tab === 'all-recipes') {
          this.getRecipes(this.type.id);
        }
        if (this.tab === 'single-recipe') {
          this.getSingleRecipe(params['contentId']);
        }
      }
    });

    jQuery('#main-container').removeClass('opening');
    jQuery('#side_navbox').removeClass('opening');
    jQuery('#right-sidebar').removeClass('opening');
    jQuery('#footer-margin').removeClass('opening');

    // pushing my program dataLayer to Analytics
    window['dataLayer'].push({
      event: 'My Program',
      my_program: 'Wellness'
    });
  }

  ngAfterViewInit() {
    if (this.user.client.weight <= 0 && this.user.client.height <= 0) {
      setTimeout(() => {
        this.openDialogQuestions();
      }, 10);
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  openDialogQuestions() {
    this.dialog.open(QuestionsComponent, {
      height: '100vh',
      hasBackdrop: false
    });
  }

  swapRecipe() {
    this.activeRecipeId >= this.slidesRecp.length - 1
      ? (this.activeRecipeId = 0)
      : (this.activeRecipeId += 1);
    this.gettingMacronutrientRations();
  }

  swapBreakfast() {
    // this.activeBreakfastId >= this.dailyBreakfasts.length - 1
    //   ? (this.activeBreakfastId = 0)
    //   : (this.activeBreakfastId += 1);
    this._myprogramService.getShuffleDailyFood(1).subscribe(data => {
      this.setDailyFood(data);
    });
  }

  swapSnack() {
    // this.activeSnackId >= this.dailySnacks.length - 1
    //   ? (this.activeSnackId = 0)
    //   : (this.activeSnackId += 1);
    this._myprogramService.getShuffleDailyFood(2).subscribe(data => {
      this.setDailyFood(data);
    });
  }

  swapLunch() {
    // this.activeLunchfastId >= this.dailyLunches.length - 1
    //   ? (this.activeLunchfastId = 0)
    //   : (this.activeLunchfastId += 1);
    this._myprogramService.getShuffleDailyFood(3).subscribe(data => {
      this.setDailyFood(data);
    });
  }

  swapDinner() {
    // this.activeDinnerfastId >= this.dailyDinners.length - 1
    //   ? (this.activeDinnerfastId = 0)
    //   : (this.activeDinnerfastId += 1);
    this._myprogramService.getShuffleDailyFood(1).subscribe(data => {
      this.setDailyFood(data);
    });
  }

  getClientType(id) {
    this.loadingClientType = true;
    this._myprogramService.getClientType(id).subscribe(data => {
      this.type = data;
      this.loadingClientType = false;
    });
  }

  getWorkoutToday(id, subcategory_id?: number) {
    this.loadingContent = true;

    let params = null;

    if (subcategory_id) {
      params = { subcategory_id: subcategory_id };
    }
    
    this._myprogramService.getWorkoutToday(id, params).subscribe(
      data => {
        this.workout = data;

        this.loadingContent = false;
        this.dailyWorkoutIsLoaded = true;
      },
      () => {
        this.dailyWorkoutIsLoaded = true;
      }
    );
  }

  getAllWorkouts() {
    this.loadingContent = true;
    this._myprogramService.getAllWorkouts().subscribe(data => {
      this.slides = data;
      this.allWorkoutLength =
        this.workoutMathWork.ceil(this.slides.length / 3) + 1;
    });
  }

  getAllWorkoutsByType(id) {
    this.loadingContent = true;
    this.allWorkoutsByType = [];
    this.showWorkoutsByType = [];
    this._myprogramService.getAllWorkoutsByType(id).subscribe(data => {
      //   console.log({ getAllWorkoutsByType: data });
      this.slides = data;
      if (this.section === 'wellness') {
        this.allWorkoutsByType = data.filter(workout => {
          return (
            workout.subcategory_id &&
            workout.subcategory_id === this.wellnessSubcategory
          );
        });
        // console.log({ allWorkoutsByTypeWellness: this.allWorkoutsByType });
      } else if (this.section === 'fitness') {
        this.allWorkoutsByType = data.filter(workout => {
          return (
            workout.category_id &&
            workout.category_id === this.workout.category_id
          );
        });

      } else {
        this.allWorkoutsByType = [...data];
      }

      if (this.allWorkoutsByType.length > 4) {
        this.showWorkoutsByType = this.allWorkoutsByType.slice(0, 4);
      } else {
        this.showWorkoutsByType = this.allWorkoutsByType;
      }

      this.allWorkoutLength =
        this.workoutMathWork.ceil(this.slides.length / 3) + 1;
    });
  }

  showAllWorkouts() {
    this.showWorkoutsByType = this.allWorkoutsByType;
  }

  getAllWorkoutsForSingle(singleWorkoutId: number) {
    this.loadingContent = true;
    this._myprogramService
      .getAllWorkoutsByType(this.type.id)
      .subscribe(data => {
        for (let typeIndex = 0; typeIndex < data.length; typeIndex++) {
          if (data[typeIndex].id === singleWorkoutId) {
            this.singleWorkoutContent = data[typeIndex];
          }
        }
      });
  }

  getArticle(article) {
    this.loadingContent = true;
    this._myprogramService.getArticle(article).subscribe(data => {
      this.root_article = data;
    });
  }

  getAllArticles(id) {
    this._myprogramService.getAllArticles(id).subscribe(data => {
      if (this.section === 'wellness' && this.tab !== 'article') {
        this.articles = data.filter(
          article =>
            article.content.subcategory &&
            (article.content.subcategory.subcategory_name.toLowerCase() ===
              this.tab.toLowerCase() ||
              (article.content.subcategory.subcategory_name.toLowerCase() ===
                'yoga' &&
                this.tab === 'daily-workout'))
        );

        // console.log({ ArticlesFilteredWellness: this.articles });
      } else if (this.section === 'fitness') {
        this.articles = data.filter(
          article =>
            article.content.category_id &&
            article.content.category_id === this.workout.category_id
        );

        // console.log({ ArticlesFitnessFiltered: this.articles });
      } else {
        this.articles = data;
        // console.log({ ArticlesAll: this.articles });
      }

      this.allArticleLength = this.workoutMathWork.ceil(
        this.articles.length / 3
      );

      for (let i = 0; i < this.allArticleLength; i++) {
        this.tempAllArticleArray.push(i);
      }
    });
  }

  getSingleRecipe(id) {
    this.loadingContent = true;
    this._myprogramService.getSingleRecipeService(id).subscribe(data => {
      // console.log('recipe_nutrients: ', data.recipe_nutrients);
      this.singleRecipeContent = data;
    });
  }

  getRecipes(type) {
    this.loadingContent = true;
    this._myprogramService.getRecipes(type).subscribe(data => {
      this.slidesRecp = data;
      if (this.slidesRecp.length && this.slidesRecp.length > 9) {
        this.recipesLength = 9;
      }
      this.allRecipeLength = this.workoutMathWork.ceil(
        this.slidesRecp.length / 3
      );
      for (let i = 0; i < this.allRecipeLength; i++) {
        this.tempAllRecipeArray.push(i);
      }
    });
  }

  getFoodByCategoryAndType(category, type) {
    this.loadingContent = true;
    this._myprogramService
      .getDailyFood()
      .subscribe(data => {
        
       this.setDailyFood(data);

        // this.food = [...data];
        // this.dailyBreakfasts = this.food.filter(
        //   item => item.meal_type_ids && item.meal_type_ids.indexOf(1) !== -1
        // );
        // this.shuffleArray(this.dailyBreakfasts);

        // this.dailySnacks = this.food.filter(
        //   item => item.meal_type_ids.indexOf(2) !== -1
        // );
        // this.shuffleArray(this.dailySnacks);

        // this.dailyLunches = this.food.filter(
        //   item => item.meal_type_ids && item.meal_type_ids.indexOf(3) !== -1
        // );
        // this.shuffleArray(this.dailyLunches);

        // this.dailyDinners = this.food.filter(
        //   item => item.meal_type_ids && item.meal_type_ids.indexOf(4) !== -1
        // );
        // this.shuffleArray(this.dailyDinners);
      });
  }

  diffDateStart(init, end) {
    const start = moment(init, 'YYYY-MM-DD');
    const now = moment(end, 'YYYY-MM-DD');
    return moment.duration(start.diff(now)).asDays() + 1;
  }

  safeImageUrl(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  myClickFunction(event) {
    this.isavailable = event;
  }

  calcRaiting(event) {
    this.workoutRaiting = event.target.id.slice(-1);
  }

  calcRecipeRaiting(event) {
    this.recipeRaiting = event.target.id.slice(-1);
  }

  scrollUpToArticles() {
    const el = <HTMLElement>document.getElementById('articles-title');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollUpToHeader() {
    const el = <HTMLElement>document.getElementById('header');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  toggleIngredientsListShadow() {
    const ingredientsListShadow = document.getElementById(
      'ingredients-list-shadow'
    );
    ingredientsListShadow.style.display = 'none';
  }

  toggleMethodDescriptionShadow() {
    const methodDescriptionShadow = document.getElementById(
      'method-description-shadow'
    );
    methodDescriptionShadow.style.display = 'none';
  }

  filterWorkouts(searchText: string) {
    if (searchText.length >= 2) {
      searchText = searchText.trim().toLowerCase();
      return (this.filteredWorkouts = this.allWorkoutsByType.filter(item =>
        item.title.trim().toLowerCase().includes(searchText)
      ));
    } else {
      return (this.filteredWorkouts = []);
    }
  }

  filterRecipes(searchText: string) {
    if (searchText.length >= 2) {
      searchText = searchText.trim().toLowerCase();
      return (this.filteredRecipes = this.slidesRecp.filter(item =>
        item.title.trim().toLowerCase().includes(searchText)
      ));
    } else {
      return (this.filteredRecipes = []);
    }
  }

  openDialogPlan(): void {
    this.dialog.open(ChangePlanComponent, {
      data: 'VOD'
    });
  }

  getClientBodyMassName() {
    const bmi = this.user.client.bmi;

    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      return 'Healthy weight';
    } else if (bmi >= 25 && bmi < 30) {
      return 'Overweight';
    } else if (bmi >= 30 && bmi < 35) {
      return 'Obese';
    } else if (bmi >= 35 && bmi < 40) {
      return 'Severely obese';
    } else if (bmi >= 40) {
      return 'Morbidly obese';
    }
  }

  setMacroNutritesToDefault() {
    this.macroNutrientCarbs = 0;
    this.macroNutrientFats = 0;
    this.macroNutrientProteins = 0;
  }

  gettingMacronutrientRations() {
    this.setMacroNutritesToDefault();

    const activeBreakfast = this.dailyBreakfasts[this.activeBreakfastId];
    const activeSnacks = this.dailySnacks[this.activeSnackId];
    const activeLunch = this.dailyLunches[this.activeLunchfastId];
    const activeDinners = this.dailyDinners[this.activeDinnerfastId];

    const breakfastNutrients = activeBreakfast.recipe_nutrients;
    const snackNutrients = activeSnacks.recipe_nutrients;
    const lunchNutrients = activeLunch.recipe_nutrients;
    const dinnerNutrients = activeDinners.recipe_nutrients;

    this.getMacroNutrientCalculations(breakfastNutrients);
    this.getMacroNutrientCalculations(snackNutrients);
    this.getMacroNutrientCalculations(lunchNutrients);
    this.getMacroNutrientCalculations(dinnerNutrients);
  }

  getMacroNutrientCalculations(data) {
    if (data.length > 0) {
      data.forEach(item => {
        if (item.nutrients_name == 'Fat') {
          this.macroNutrientFats += parseInt(item.nutrients_value);
        }

        if (item.nutrients_name == 'Carbs') {
          this.macroNutrientCarbs += parseInt(item.nutrients_value);
        }

        if (item.nutrients_name == 'Protein') {
          this.macroNutrientProteins += parseInt(item.nutrients_value);
        }
      });
    }
  }

  getIsMobile(): boolean {
    let width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const breakpoint = 720;
    return width <= breakpoint;
  }

  // setting food data for the respective menu items
  setDailyFood(data) {
    this.dailyBreakfasts = [];
    this.dailyDinners = [];
    this.dailySnacks = [];
    this.dailyLunches = [];

    this.dailyBreakfasts.push(data.breakfast);
    this.dailyDinners.push(data.dinner);
    this.dailySnacks.push(data.snack);
    this.dailyLunches.push(data.lunch);

    this.gettingMacronutrientRations();
  }
}
