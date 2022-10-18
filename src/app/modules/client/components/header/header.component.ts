import { QuestionsComponent } from './../../../shared/components/questions/questions.component';
import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { TypesComponent } from '../../../shared/components/types/types.component';
import { LoginService } from '../../../../components/login/login.service';
import { StorageService } from '../../../../services/auth/storage.service';
import { CategoriesService } from '../../../admin/modules/packages/components/categories/categories.service';
import { ContactsService } from '../../../shared/components/contacts/contacts.service';
import { User } from '../../../../models/user/user.model';
import { Types } from '../../../../models/types/types.model';
import { Categories } from '../../../../models/categories/categories.model';
import { ChangePlanComponent } from '../../../shared/components/change-plan/change-plan.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, DoCheck {
  public categories: Categories[];
  public questionary: Array<any>;
  public user: User;
  public pendings: number;
  public _opened: boolean = false;
  public _programSub: boolean = false;
  private _linkClicked: boolean = false;
  private _openTimeout;
  private _closeTimeout;
  showFiller = false;
  public section: string;
  public tab: string;
  public type: Types;
  @ViewChild(CalendarComponent, { static: false })
  CalendarComponentRef: CalendarComponent;
  @ViewChild(TypesComponent, { static: false })
  TypesComponentRef: TypesComponent;

  public title = '';
  public search = false;
  public currentUrl = '';
  // public activeChat = false;

  public noFitnessPopup = false;
  public noNutritionPopup = false;
  public noWellnessPopup = false;
  public noProgramPopup = false;

  constructor(
    public _loginService: LoginService,
    public _storageService: StorageService,
    public _route: ActivatedRoute,
    public rtr: Router,
    public _categoriesService: CategoriesService,
    public _contactsService: ContactsService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.pendings = 0;
    this.section = '';
    this.tab = '';
  }

  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();
    this.listCategories();
    this.title = 'dashboard';

    // this._route.params.subscribe(params => {
    //   this.type.id = params['type'];
    //   this.section = params['section'];
    // this.section = params['subsection'];
    //   this.tab = params['tab'];
    // })

    this._storageService.isUserChanged.subscribe((user) => {
      this.user = user;
    });

    // this._socket
    //   .getDataUser()
    //   .subscribe(data => {
    //
    //   });

    this._contactsService
      .getMyFriendsList(this.user.firestore_uid)
      .subscribe((data) => {
        this.pendings = 0;
        data.forEach((doc) => {
          this.pendings += doc.chat.pendings;
        });
      });
  }

  public _toggleSidebar() {
    this._opened = !this._opened;
  }

  showCalendar() {
    this.CalendarComponentRef.openModal();
  }

  showModalTypes(id, title) {
    this.closeMenuSideBar();
    this.TypesComponentRef.getClientTypeIdForMyProgram(id, title);
  }

  ngDoCheck() {
    this.currentUrl = this.rtr.url;
    if (this.currentUrl.includes('home')) {
      this.title = 'Dashboard';
    } else if (this.currentUrl.includes('progress')) {
      this.title = 'Progress';
    } else if (this.currentUrl.includes('calendar')) {
      this.title = 'Calendar';
    } else if (this.currentUrl.includes('profile')) {
      this.title = 'Settings';
    } else if (this.currentUrl.includes('nutrition-program')) {
      this.title = 'Nutrition';
    } else if (this.currentUrl.includes('fitness')) {
      this.title = 'Fitness';
    } else if (this.currentUrl.includes('wellness')) {
      this.title = 'Wellness';
    } else if (this.currentUrl.includes('user')) {
      this.title = 'Profile';
    } else if (this.currentUrl.includes('vod')) {
      this.title = 'Video On Demands';
    }
  }

  openChat() {
    jQuery('#contact_box').toggleClass('opening');
  }

  toggleProgramSub() {
    this._programSub = !this._programSub;
  }

  toggleSideBar() {
    this._opened = !this._opened;

    if (this._opened) {
      jQuery('#main-container').addClass('opening');
      jQuery('#side_navbox').addClass('opening');
      jQuery('#right-sidebar').addClass('opening');
      jQuery('#footer-margin').addClass('opening');
    } else {
      jQuery('#main-container').removeClass('opening');
      jQuery('#side_navbox').removeClass('opening');
      jQuery('#right-sidebar').removeClass('opening');
      jQuery('#footer-margin').removeClass('opening');
    }
  }

  openSidebar() {
    clearTimeout(this._closeTimeout);
    this._openTimeout = setTimeout(() => {
      this._opened = true;
      jQuery('#main-container').addClass('opening');
      jQuery('#side_navbox').addClass('opening');
      jQuery('#right-sidebar').addClass('opening');
      jQuery('#footer-margin').addClass('opening');
    }, 200);
  }

  closeSidebar() {
    clearTimeout(this._openTimeout);
    this._closeTimeout = setTimeout(() => {
      this._opened = false;
      jQuery('#main-container').removeClass('opening');
      jQuery('#side_navbox').removeClass('opening');
      jQuery('#right-sidebar').removeClass('opening');
      jQuery('#footer-margin').removeClass('opening');
      this._linkClicked = true;
    }, 200);
  }

  /**
   * Obtiene lista de categorias de contenidos
   *
   * @return void
   */
  public listCategories(): void {
    this._categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  public logout(): void {
    this._loginService.logout().subscribe(
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

  openDialogPlan(): void {
    const dialogRef = this.dialog.open(ChangePlanComponent, {
      data: 'header'
    });
  }

  navigateToFitness() {
    this.closeMenuSideBar();


    //  checking if the user is lead
    if (this.user.client.membership.id === 4) {
      // this.user.client.subscription_upgrade ? this.showModalTypes(9, 'fitness') : this.noProgramPopup = true;
      if (this.user.client.subscription_upgrade) {
        // pushing my program dataLayer to Analytics
        window['dataLayer'].push({
          event: 'My Program',
          my_program: 'Fitness',
        });
        this.showModalTypes(9, 'fitness');
      } else {
        this.noProgramPopup = true;
      }
    } else {
      // pushing my program dataLayer to Analytics
      window['dataLayer'].push({
        event: 'My Program',
        my_program: 'Fitness',
      });
      this.showModalTypes(9, 'fitness');
    }
  }

  navigateToNutrition() {
    if (this.user.client.nutrition_type) {
      // pushing my program dataLayer to Analytics
      window['dataLayer'].push({
        event: 'My Program',
        my_program: 'Nutrition',
      });
      this.rtr.navigate([
        '/board/u/myprogram/filter/',
        this.user.client.nutrition_type,
        'nutrition-program',
      ]);
      this.closeMenuSideBar();
    } else {
      this.dialog.open(QuestionsComponent, {
        height: '100vh',
        hasBackdrop: false,
      });

      this.closeMenuSideBar();
    }
  }

  openMenuSideBar() {
    const leftSideBar = this.document.querySelector(
      '.leftside-bar'
    ) as HTMLElement;
    const menuOpenButton = this.document.querySelector(
      '.topside-bar-menu-button-open'
    ) as HTMLElement;
    const menuCloseButton = this.document.querySelector(
      '.topside-bar-menu-button-close'
    ) as HTMLElement;
    leftSideBar.classList.add('leftside-bar-display');
    menuOpenButton.style.display = 'none';
    menuCloseButton.style.display = 'inline-block';
  }

  closeMenuSideBar() {
    const leftSideBar = this.document.querySelector(
      '.leftside-bar'
    ) as HTMLElement;
    const menuOpenButton = this.document.querySelector(
      '.topside-bar-menu-button-open'
    ) as HTMLElement;
    const menuCloseButton = this.document.querySelector(
      '.topside-bar-menu-button-close'
    ) as HTMLElement;
    leftSideBar.classList.remove('leftside-bar-display');
    menuOpenButton.style.display = 'inline-block';
    menuCloseButton.style.display = 'none';
  }
}
