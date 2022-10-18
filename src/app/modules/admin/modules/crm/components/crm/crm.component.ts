import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../../../models/user/user.model';
import { CrmService } from '../../../../../../services/crm/crm.service';
import { Memberships } from '../../../../../../models/memberships/memberships.model';
import { BuilderComponent } from '../../../packages/components/builder/builder.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AddLeadComponent } from '../add-lead/add-lead.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.css'],
})
export class CrmComponent implements OnInit, AfterViewInit, OnDestroy {
  public loader: boolean;
  public clientType: string;
  public showClientType: string;
  public showUsersAmount: number;
  public searchString: string;
  public data: any[];
  public newData: any[];
  public filters: any = {};
  public searchTimeout = 0;
  public displayedColumns: string[];
  public membership: number | number[];
  public sortDirection = false;
  public checkedUsers: number[];
  public currentPage: number;
  public totalPages: number;
  public pagesList: any[];
  public totalItems: number;
  public crmFilters: any;
  public showFilterField: string;
  public clientMemberships: any[];
  public editUserFields: any[];

  @ViewChild(EditUserComponent, { static: false }) userEdit: EditUserComponent;
  @ViewChild(AddLeadComponent, { static: false }) addLead: AddLeadComponent;

  constructor(
    private _route: ActivatedRoute,
    private _crmService: CrmService,
    private elementRef: ElementRef,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.resetAll();
      this.clientType = params.type;
      this.showClientType = this.clientType.replace('_', ' ');
      this.filters.membership =
        this.clientType === 'leads'
          ? 5
          : this.clientType === 'free_users'
          ? 4
          : [1, 2, 3];
      this.displayedColumns = [
        'check',
        'id',
        'name',
        'datetime',
        'email',
        'assigned_am',
        'status',
        'country',
        'time',
        ...(this.filters.membership === 5 ? ['source'] : []),
        ...(this.filters.membership === 4 ? ['payment'] : []),
        ...(this.filters.membership !== 5 && this.filters['membership'] !== 4
          ? ['membership']
          : []),
        'last_tp',
        'actions',
      ];
      this.fetchData();
      this.getFilters();
    });
  }

  ngAfterViewInit() {
    document
      .querySelector('#app')
      .addEventListener('mousedown', this.onClick.bind(this));
  }

  public resetAll() {
    this.showUsersAmount = 25;
    this.currentPage = 1;
    this.filters = {
      country: [],
      manager_id: [],
      membership: [],
      status: [],
      source: [],
    };
    this.checkedUsers = [];
  }

  public onClick(event) {
    const filterOpened = this.showFilterField !== '';
    if (filterOpened && !event.target.closest('.filter-list')) {
      this.showFilterField = '';
    }
  }

  public fetchData() {
    // console.log({ Filters: this.filters });
    this.data = [];
    this.loader = true;
    this._crmService
      .getCrmData(this.showUsersAmount, this.currentPage, this.filters)
      .subscribe(
        (response) => {
          this.data = response.items.map((item) => {
            const newObject = { ...item, actions: null };
            return newObject;
          });
          this.currentPage = response._meta.currentPage;
          this.totalPages = response._meta.pageCount;
          this.totalItems = response._meta.totalCount;
          this.pagesList = new Array(+this.totalPages);
          this.loader = false;
        },
        (err) => {
          console.log(err);
          this.loader = false;
        }
      );
  }

  isChecked() {
    return this.checkedUsers.length === this.data.length;
  }

  toggleAll(event) {
    if (event.target.checked === true) {
      this.checkedUsers = [];
      this.data.forEach((row) => {
        this.checkedUsers.push(row.id);
      });
    } else {
      this.checkedUsers = [];
    }
  }

  public checkUser(id) {
    const index = this.checkedUsers.indexOf(id);
    if (index !== -1) {
      this.checkedUsers.splice(index, 1);
    } else {
      this.checkedUsers.push(id);
    }
  }

  findID(id) {
    return this.checkedUsers.includes(id);
  }

  public getFilters() {
    this.loader = true;
    this._crmService.getCrmFilters().subscribe((filters) => {
      this.crmFilters = filters;
      this.clientMemberships = filters.memberships.filter(
        (item) => item.id !== 4 && item.id !== 5
      );
      this.editUserFields = [
        {
          name: 'Department',
          fieldName: 'membership_id',
          options: this.crmFilters.memberships,
        },
        {
          name: 'Status',
          fieldName: 'status_id',
          options: this.crmFilters.statuses,
        },
        {
          name: 'Account Manager',
          fieldName: 'manager_id',
          options: this.crmFilters.assigned_ams,
        },
      ];
    });
  }

  public handleSearchStringChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.searchString.length > 2) {
      this.filters.search_string = this.searchString;
      this.searchTimeout = setTimeout(() => {
        this.fetchData();
      }, 500);
    } else if (this.searchString.length === 0) {
      if (this.filters.search_string) {
        delete this.filters.search_string;
      }
      clearTimeout(this.searchTimeout);
      this.fetchData();
    } else {
      clearTimeout(this.searchTimeout);
    }
  }

  public handleActionBtnClick() {
    this.userEdit.openModal(this.checkedUsers, this.editUserFields);
  }

  public handleAddEntryBtnClick() {
    this.addLead.openModal();
  }

  public handleSort(field) {
    if (!this.filters.sort || this.filters.sort.indexOf(field) === -1) {
      this.sortDirection = true;
    } else {
      this.sortDirection = !this.sortDirection;
    }
    this.filters.sort = this.sortDirection ? field : `-${field}`;
    this.fetchData();
  }

  handleFilterChange(field, val) {
    if (field === 'payment') {
      this.filters.payment && this.filters.payment === val
        ? delete this.filters.payment
        : (this.filters.payment = val);
    } else {
      const index = this.filters[field].indexOf(val);
      // console.log({ index });
      if (index !== -1) {
        this.filters[field].splice(index, 1);
      } else {
        this.filters[field].push(val);
      }
    }
    this.fetchData();
  }

  public showFilter(field) {
    this.showFilterField = field;
  }

  public handlePageChange(i) {
    this.currentPage = i + 1;
    this.fetchData();
  }

  ngOnDestroy() {
    document
      .querySelector('#app')
      .removeEventListener('mousedown', this.onClick.bind(this));
  }

  deleteSelected() {
    this.loader = true;

    const payload = {
      ids: this.checkedUsers,
    };

    if (this.checkedUsers.length > 0) {
      this._crmService.deleteUsers(payload).subscribe(
        (res) => {
          this.loader = false;
          this.toastService.success(res['message']);
          this.resetAll();
          this.fetchData();
          this.getFilters();
        },
        (error) => {
          console.log({ error });
          this.loader = false;
        }
      );
    } else {
      this.loader = false;
      this.toastService.info(
        'Please select the items to be deleted before continuing with this action'
      );
    }
  }
}
