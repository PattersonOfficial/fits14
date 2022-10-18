import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PlanService} from '../plan.service';
import {Plan} from '../../../../../../../models/plan/plan.model';
import {Subcategory, WELLNESS_CATEGORY_ID} from '../../../../../../../models/categories/categories.model';
import {ARTICLE_TYPE, Contents, VIDEO_TYPE} from '../../../../../../../models/contents/contents.model';
import {ContentsService} from '../../contents/contents.service';

@Component({
    selector: 'app-plan-wellness',
    templateUrl: './plan_wellness.component.html',
    styleUrls: ['./plan_wellness.component.css']
})

export class PlanWellnessComponent implements OnInit {
    VIDEO_TYPE = VIDEO_TYPE;
    ARTICLE_TYPE = ARTICLE_TYPE;

    selectedPlan: Plan;
    selectedSubcategory: Subcategory;
    filteredContents: Contents[];

    plans: Plan[];
    contentList: Contents[];
    subcategories: Subcategory[];

    plan: Plan;
    planContentList: Contents[];

    invalidForm = false;
    mismatchValidDays: number;

    constructor(
        public _planService: PlanService,
        public _router: Router,
        public _contentsService: ContentsService,
    ) {
        this.plans = [];
        this.subcategories = [];
        this.contentList = [];

        this.selectedPlan = null;
        this.selectedSubcategory = null;

        this.resetPlanForm();
    }

    ngOnInit() {
        this.getPlans();
        this.getContent();
        this.getSubcategories();
    }

    getPlans() {
        this._planService.getPlans({category_id: WELLNESS_CATEGORY_ID}).subscribe(
            data => this.plans = data || []
        );
    }

    getContent() {
        this._contentsService.getListByFilter({category_id: WELLNESS_CATEGORY_ID, type: VIDEO_TYPE}).subscribe(data => {
            this.contentList = data || [];

            this.filterContentList();
        });
    }

    getSubcategories() {
        this._planService.getSubcategoriesByCategoryId(WELLNESS_CATEGORY_ID).subscribe(
            data => this.subcategories = data || []
        );
    }

    filterContentList() {
        if (this.selectedSubcategory) {
            this.filteredContents = this.contentList.filter(content => content['subcategory_id'] === this.selectedSubcategory.id);
        } else {
            this.filteredContents = this.contentList;
        }
    }

    postContent(): void {
        if (this.plan.valid_days > 0 && this.plan.valid_days === this.planContentList.length && this.plan.name.trim() !== '') {
            this.invalidForm = false;

            this.plan.category_id = WELLNESS_CATEGORY_ID;

            if (this.plan.id == null && this.planContentList.length !== 0) {
                this.plan.content = this.planContentList;

                this._planService.createPlan(this.plan).subscribe(
                    () => {
                        this.resetPlanForm();
                        this.getPlans();
                    });
            } else {
                this.plan.content = this.planContentList;

                this._planService.updatePlan(this.plan).subscribe(
                    () => {
                        this.resetPlanForm();
                        this.getPlans();
                    });
            }
        } else {
            this.invalidForm = true;
            this.mismatchValidDays = this.plan.valid_days - this.planContentList.length;
        }
    }

    resetPlanForm() {
        this.plan = new Plan;
        this.planContentList = [];
        this.selectedPlan = null;
    }

    onPlanChange(): void {
        this.plan = this.selectedPlan;
        this.planContentList = this.selectedPlan.content;
    }

    onDeletePlanClick() {
        if (this.selectedPlan && confirm('Are you sure to delete ' + this.selectedPlan.name + '?')) {
            this._planService.deletePlan(this.selectedPlan).subscribe(
                () => {
                    this.resetPlanForm();
                    this.getPlans();
                });
        }
    }

    onRemoveWorkoutClick(index: number) {
        this.planContentList.splice(index, 1);
    }

    onSubcategoryChange() {
        this.filterContentList();
    }

    dropFromContainer(event: CdkDragDrop<Contents[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }

    dropToContainer(event: CdkDragDrop<Contents[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }
}
