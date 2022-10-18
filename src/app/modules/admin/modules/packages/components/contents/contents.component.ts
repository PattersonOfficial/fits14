import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ContentsService} from './contents.service';
import {DataTableDirective} from 'angular-datatables';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {BuilderComponent} from '../builder/builder.component';
import {WebViewComponent} from '../webview/webview.component';
import {Router, ActivatedRoute} from '@angular/router';
import {Contents} from '../../../../../../models/contents/contents.model';
import {Subcategory} from '../../../../../../models/categories/categories.model';
import {User} from '../../../../../../models/user/user.model';
import {UsersService} from '../../../users/components/users/users.service';
import {HttpParams} from '@angular/common/http';
import {Global} from '../../../../../../app.global';
import {Calories} from '../../../../../../models/calories/calories.model';
import {CategoriesService} from '../categories/categories.service';

@Component({
    selector: 'app-contents',
    templateUrl: './contents.component.html',
    styleUrls: ['./contents.component.css']
})
export class ContentsComponent implements OnInit {
    contents: Contents[];
    filteredContents: Contents[];

    subcategoryList: Subcategory[];
    dailyCaloriesList: Calories[];
    mentors: User[];

    filter = {
        typeId: null,
        mentorId: null,
        subcategoryId: null,
        dailyCaloriesId: null,
    };

    public dtTrigger: Subject<any> = new Subject();
    public dtOptions;
    public category__: number;

    @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
    @ViewChild('modalCategoriesRef', {static: false}) modalCategoriesRef: ModalDirective;
    @ViewChild(BuilderComponent, {static: false}) contentsBuilder: BuilderComponent;
    @ViewChild(WebViewComponent, {static: false}) webview: WebViewComponent;

    constructor(
        public _categoriesService: CategoriesService,
        public _contentsService: ContentsService,
        public _userService: UsersService,
        public _route: ActivatedRoute,
        public _router: Router
    ) {
        this.category__ = 0;
    }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            language: {
                'search': ' '
            }
        };

        this._route.params.subscribe(params => {
            this.category__ = Number(params['category']);
        });

        this.listContents(this.category__);
        this.loadSubcategoriesByCategoryId(this.category__);
        this.getMentors();
        this.getDailyCaloriesList();
    }

    listContents(category): void {
        this._contentsService.getContents(category).subscribe(
            data => {
                this.contents = data;

                this.reloadGridByFilter();

                this.dtTrigger.next();
            }
        );
    }

    loadSubcategoriesByCategoryId(category): void {
        this._contentsService.getSubcategoriesByCategoryId(category).subscribe(
            data => {
                this.subcategoryList = data;
            });
    }

    getDailyCaloriesList() {
        this._categoriesService.getCaloriesList().subscribe(
            data => {
                this.dailyCaloriesList = data;
            }
        );
    }

    getMentors(): void {
        const params = new HttpParams().append('role_id', String(Global.roles.mentor));

        this._userService.getUsers(params).subscribe(
            mentors => {
                this.mentors = mentors;
            });
    }

    pushNewContent() {
        this.listContents(this.category__);
    }

    trashContent(content: Contents): void {
        this._contentsService.trashContent(content).subscribe(
            () => {
                this.listContents(this.category__);
            }
        );
    }

    destroyDtInstance(): void {
        this.dtElement.dtInstance.then(dtInstance => {
            dtInstance.destroy();
        });
    }

    reloadGridByFilter() {
        this.filteredContents = this.contents.filter((content) => {
            const dailyCaloriesFiltered = content.daily_calories.filter(dailyCalories => {
                return dailyCalories.id === Number(this.filter.dailyCaloriesId);
            });
            
            return !(
                (this.filter.typeId && content.type !== +this.filter.typeId)
                || (this.filter.subcategoryId && content.subcategory_id !== +this.filter.subcategoryId)
                || (this.filter.mentorId && content.client_id !== +this.filter.mentorId)
                || (this.filter.dailyCaloriesId && !dailyCaloriesFiltered.length)
            );
        });
    }
}
