import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// ----------Angular Fire------------------
import { AngularFirestore } from '@angular/fire/firestore';
// ----------Angular Material---------------
import { MatDialog } from '@angular/material/dialog';
// ----------Services---------------
import { HomeService } from './home.service';
import { StorageService } from '../../../../../../services/auth/storage.service';
// ----------Components---------------
import { QuestionsComponent } from '../../../../../shared/components/questions/questions.component';
import { WebViewComponent } from '../../../../../admin/modules/packages/components/webview/webview.component';
import { TypesComponent } from '../../../../../shared/components/types/types.component';
// ----------Models---------------
import { User } from '../../../../../../models/user/user.model';
import { Types } from '../../../../../../models/types/types.model';

import { TypesService } from '../../../../../shared/components/types/types.service';
import { ChangePlanComponent } from '../../../../../shared/components/change-plan/change-plan.component';
import { CategoriesService } from '../../../../../admin/modules/packages/components/categories/categories.service';
import { Router } from '@angular/router';
import { Contents } from '../../../../../../models/contents/contents.model';
import { ToastrService } from 'ngx-toastr';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-client-home',
  templateUrl: './home-new.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  public user: User;
  public type: Types;
  canvas: any;
  ctx: any;
  public fitnessTypeId: any;
  @ViewChild(TypesComponent, { static: false })
  TypesComponentRef: TypesComponent;
  @ViewChild(QuestionsComponent, { static: false })
  questionsRef: QuestionsComponent;
  @ViewChild(WebViewComponent, { static: false }) webview: WebViewComponent;
  workout: Contents;
  public slidesRecp: any;
  public activeRecipeId: number = 0;
  public workoutRaiting: string = '4';
  public dayPhase: number;
  public dayPhaseString: string;
  public noNutritionPopup: boolean = false;
  public noWellnessPopup: boolean = false;
  public noProgramPopup: boolean = false;
  public carbs = '';
  public calories = '';
  public fat = '';
  public protein = '';
  public carouselOptions;
  fitnessSubcategory = 777;
  dailyWorkoutIsLoaded = false;

  isMobile = false;

  constructor(
    public _storageService: StorageService,
    private _firestore: AngularFirestore,
    private _sanitizer: DomSanitizer,
    private _homeservice: HomeService,
    private _typesService: TypesService,
    private _categoriesService: CategoriesService,
    public dialog: MatDialog,
    public _router: Router,
    private toastService: ToastrService
  ) {
    this.workout = null;
    this.slidesRecp = [];
    this.type = new Types();
    this.fitnessTypeId = '';
    const time = new Date().getHours();
    switch (time) {
      case 6:
      case 7:
      case 8:
      case 9:
        this.dayPhase = 1;
        this.dayPhaseString = 'Breakfast';
        break;

      case 10:
      case 11:
        this.dayPhase = 2;
        this.dayPhaseString = 'Snack';
        break;

      case 12:
      case 13:
      case 14:
      case 15:
        this.dayPhase = 3;
        this.dayPhaseString = 'Launch';
        break;

      default:
        this.dayPhase = 4;
        this.dayPhaseString = 'Dinner';
    }
  }

  ngOnInit() {
    this.isMobile = this.getIsMobile();

    window.onresize = () => {
      this.isMobile = this.getIsMobile();
    };
    this.getMealTypes();

    this.carouselOptions = {
      items: 1.5,
      autoWidth: true,
      dots: false,
      loop: false,
      nav: true,
      autoplay: false,
      autoplayTimeout: 5000,
      margin: 10,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    };

    this.user = this._storageService.getCurrentUser();
    this._firestore.collection('users').doc(this.user.firestore_uid).set(
      {
        status: 1,
      },
      { merge: true }
    );

    this._storageService.isUserChanged.subscribe((user) => {
      this.user = user;
    });

    if (this.user.client) {
      this._homeservice
        .getTypesOfCategory({
          id: 9,
          title: 'fitness',
        })
        .subscribe((data) => {
          const mainTypes = data.types;
          this._homeservice.getMyClientTypes().subscribe((data1) => {
            for (let typeIndex = 0; typeIndex < mainTypes.length; typeIndex++) {
              if (
                data1.types.map((e) => e.id).indexOf(mainTypes[typeIndex].id) !=
                -1
              ) {
                this.fitnessTypeId = mainTypes[typeIndex].id;
                this.getWorkoutToday(
                  this.fitnessTypeId,
                  this.fitnessSubcategory
                );
                this.getRecipes(this.user.client.nutrition_type);
                break;
              }
            }
          });
        });
    }
    jQuery('#main-container').removeClass('opening');
    jQuery('#side_navbox').removeClass('opening');
    jQuery('#right-sidebar').removeClass('opening');
    jQuery('#footer-margin').removeClass('opening');
    jQuery('#right-sidebar').removeClass('hiding');
  }

  toWellness(tab) {
    this.TypesComponentRef.getClientTypeIdForMyProgram(13, 'wellness', tab);
  }

  openDialogQuestions() {
    this.dialog
      .open(QuestionsComponent, {
        height: '100vh',
        hasBackdrop: false,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response === true) {
          this._router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this._router.navigate(['/board/u/home']);
            });
        }
      });
  }

  noNutrition() {
    this.noNutritionPopup = true;
  }

  ngAfterViewInit() {
    if (this.user.client.weight <= 0 && this.user.client.height <= 0) {
      if (this.user.client.membership.id !== 4) {
        setTimeout(() => {
          this.openDialogQuestions();
        }, 10);
      }
    }
  }

  setDefaultNutrients(recipeIndex) {
    const currentRecipeNutrients =
      this.slidesRecp[recipeIndex]['recipe_nutrients'];
    const itemCarbs = currentRecipeNutrients.filter(
      (item) => item.nutrients_name.toLowerCase() === 'carbs'
    );
    const carbsExist = itemCarbs.length > 0;
    const itemFat = currentRecipeNutrients.filter(
      (item) => item.nutrients_name.toLowerCase() === 'fat'
    );
    const fatExist = itemFat.length > 0;
    const itemProtein = currentRecipeNutrients.filter(
      (item) => item.nutrients_name.toLowerCase() === 'protein'
    );
    const proteinExist = itemProtein.length > 0;
    const itemCalories = currentRecipeNutrients.filter(
      (item) => item.nutrients_name.toLowerCase() === 'calories'
    );
    const caloriesExist = itemCalories.length > 0;
    this.carbs = carbsExist ? itemCarbs[0].nutrients_value : 0;
    this.fat = fatExist ? itemFat[0].nutrients_value : 0;
    this.protein = proteinExist ? itemProtein[0].nutrients_value : 0;
    this.calories = caloriesExist ? itemCalories[0].nutrients_value : 0;
  }

  swapRecipe() {
    this.activeRecipeId >= this.slidesRecp.length - 1
      ? (this.activeRecipeId = 0)
      : (this.activeRecipeId += 1);

    this.setDefaultNutrients(this.activeRecipeId);
  }

  getRecipes(type) {
    this._homeservice
      .getRecipes({
        id: type,
        meal_type_id: this.dayPhase,
        random: true,
        limit: 50,
      })
      .subscribe((data) => {
        this.slidesRecp = [...data];
        this.setDefaultNutrients(0);
      });
  }

  getMealTypes() {
    this._categoriesService.getMeals().subscribe();
  }

  getWorkoutToday(id, subcategory_id?: number) {
    let params = null;

    if (subcategory_id) {
      params = { subcategory_id: subcategory_id };
    }

    this._homeservice.getWorkoutToday(id, params).subscribe(
      (data) => {
        this.workout = data;
        this.dailyWorkoutIsLoaded = true;
      },
      () => {
        this.dailyWorkoutIsLoaded = true;
      }
    );
  }

  safeImageUrl(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  calcRaiting(event) {
    this.workoutRaiting = event.target.id.slice(-1);
  }

  // ----------- Dialog: Change Plan ----------------
  openDialogPlan(): void {
    this.noNutritionPopup = false;
    this.noProgramPopup = false;
    this.noWellnessPopup = false;
    const dialogRef = this.dialog.open(ChangePlanComponent, {
      data: 'Home',
    });
  }

  navigateToRecipe() {
    if (this.slidesRecp.length > 0) {
      this._router.navigate([
        '/board/u/myprogram/filter/',
        this.user.client.nutrition_type,
        'nutrition-program',
        'single-recipe',
        this.slidesRecp[this.activeRecipeId].id,
      ]);
    } else {
      if (this.user.client.membership.id !== 4) {
          this.openDialogQuestions();
      } else {
        this.toastService.info('Only subscibed users can access this feature');
      }
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
}
