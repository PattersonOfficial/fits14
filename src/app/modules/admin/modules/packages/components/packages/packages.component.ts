import {Component, OnInit, ViewChild} from '@angular/core';

import {TypesService} from '../types/types.service';
import {PackagesService} from './packages.service';
import {BuilderComponent} from '../builder/builder.component';
import {WebViewComponent} from '../webview/webview.component';
import {Memberships} from '../../../../../../models/memberships/memberships.model';
import {Types} from '../../../../../../models/types/types.model';
import {Plan} from '../../../../../../models/plan/plan.model';
import {CategoriesService} from '../categories/categories.service';
import {Categories, NUTRITION_CATEGORY_ID} from '../../../../../../models/categories/categories.model';


@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
    @ViewChild(BuilderComponent, {static: false}) contentsBuilder: BuilderComponent;
    @ViewChild(WebViewComponent, {static: false}) webview: WebViewComponent;

    memberships: Memberships[];
    types: Types[];
    plans: Plan[];
    categories: Categories[];

    filteredTypes: Types[];
    packagePlans: Plan[];

    selectedMembership: Memberships;
    selectedType: Types;

    packageSaveResponseText: string;
    loadingPackage: boolean;

    constructor(
        public _packagesService: PackagesService,
        public _typesService: TypesService,
        public _categoriesService: CategoriesService,
    ) {
        this.memberships = [];
        this.types = [];
        this.plans = [];
        this.categories = [];

        this.filteredTypes = [];

        this.resetPackageForm();
    }

    ngOnInit() {
        this.getMemberships();
        this.getTypes();
        this.getPlans();
        this.getCategories();
    }

    getMemberships(): void {
        this._packagesService.getMemberships().subscribe(
            data => this.memberships = data
        );
    }

    getTypes(): void {
        this._typesService.getTypes().subscribe(
            (data) => {
                this.types = data.filter(type => type.category_id !== NUTRITION_CATEGORY_ID);
            }
        );
    }

    getPlans(): void {
        this._packagesService.getPlans().subscribe(
            data => this.plans = data
        );
    }

    getCategories(): void {
        this._categoriesService.getCategories().subscribe(
            data => this.categories = data
        );
    }

    getPlansByCategoryId(category_id: number): Plan[] {
        return this.plans.filter(plan => plan.category_id === category_id);
    }

    savePackage(): void {
        this.loadingPackage = true;
        this.packageSaveResponseText = null;

        const type = new Types;
        type.id = this.selectedType.id;
        type.plans = this.packagePlans;

        this._packagesService.updateType(type).subscribe(
            () => {
                this.resetPackageForm();
            },
            (response) => {
                this.loadingPackage = false;
                this.packageSaveResponseText = response.error;
            }
        );
    }

    resetPackageForm() {
        this.loadingPackage = false;
        this.packagePlans = [];
        this.selectedMembership = null;
        this.selectedType = null;
        this.packageSaveResponseText = null;
    }

    addPlanToPackage(plan) {
        if (this.selectedMembership && this.selectedType) {
            this.packagePlans.push(plan);
        }
    }

    onRemovePlanClick(index: number) {
        this.packagePlans.splice(index, 1);
    }

    onMembershipChange() {
        this.packagePlans = [];
        this.filteredTypes = [];

        this.filterTypes();

        this.selectedType = null;
    }

    onTypeChange(): void {
        this.loadingPackage = true;

        this._packagesService.getType(this.selectedType.id).subscribe(
            (type) => {
                this.packagePlans = type.plans;
                this.loadingPackage = false;
            }
        );
    }

    filterTypes() {
        if (this.selectedMembership) {
            this.filteredTypes = this.types.filter(type => type.membership.id === this.selectedMembership.id);
        }
    }

    isAddToPackageEnabled(plan) {
        return this.selectedType
            && this.selectedType.category.id === plan.category_id
            && this.packagePlans.map((e) => e.id).indexOf(plan.id) === -1;
    }

    isSavePackageEnabled() {
        return this.selectedMembership && this.selectedType;
    }
}
