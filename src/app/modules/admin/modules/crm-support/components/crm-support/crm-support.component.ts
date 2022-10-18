import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {EditTicketComponent} from '../edit-ticket/edit-ticket.component';
import {AddTicketComponent} from '../add-ticket/add-ticket.component';
import {ConfirmModalComponent} from '../../../../../shared/components/confirm-modal/confirm-modal.component';
import {Ticket} from '../../../../../../models/crm/support-ticket.model';
import {SendEmailComponent} from '../send-email/send-email.component';
import {TicketMailHistoryComponent} from '../ticket-mail-history/ticket-mail-history.component';
import {ViewPostComponent} from '../view-post/view-post.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crm-support',
  templateUrl: './crm-support.component.html',
  styleUrls: ['../../../crm/components/crm/crm.component.css'],
})
export class CrmSupportComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(EditTicketComponent, { static: false })
  ticketEdit: EditTicketComponent;
  @ViewChild(AddTicketComponent, { static: false })
  addTicket: AddTicketComponent;
  @ViewChild(SendEmailComponent, { static: false })
  sendEmail: SendEmailComponent;
  @ViewChild(TicketMailHistoryComponent, { static: false })
  viewStory: TicketMailHistoryComponent;
  @ViewChild(ConfirmModalComponent, { static: false })
  confirmModal: ConfirmModalComponent;
  @ViewChild(ViewPostComponent, { static: false })
  viewPostComponent: ViewPostComponent;

  public loader: boolean;
  public showTicketsAmount: number;
  public searchString: string;
  public data: any[];
  public filters: any = {};
  public searchTimeout = 0;
  public displayedColumns: string[];
  public membership: number | number[];
  public sortDirection = false;
  public checkedTickets: number[];
  public currentPage: number;
  public totalPages: number;
  public pagesList: any[];
  public totalItems: number;
  public crmFilters: any;
  public showFilterField: string;
  public editTicketsFields: any[];
  public activeTicketId: number;
  public activeEmail: string;

  constructor(
    private _route: ActivatedRoute,
    private _crmService: CrmService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this._route.params.subscribe(() => {
      this.resetAll();
      this.displayedColumns = [
        'check',
        'id',
        'user_id',
        'updated_at',
        'name',
        'email',
        'phone',
        'time',
        'status',
        'source',
        'assigned_am',
        'comment',
        'post_id',
        'actions',
        'delete',
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

  resetAll() {
    this.showTicketsAmount = 25;
    this.currentPage = 1;
    this.crmFilters = {};
    this.filters = {
      manager_id: [],
      status: [],
      source: [],
    };
    this.checkedTickets = [];
  }

  isChecked() {
    return this.checkedTickets.length === this.data.length;
  }

  toggleAll(event) {
    if (event.target.checked === true) {
      this.checkedTickets = [];
      this.data.forEach((row) => {
        this.checkedTickets.push(row.id);
      });
    } else {
      this.checkedTickets = [];
    }
  }

  findID(id) {
    return this.checkedTickets.includes(id);
  }

  onClick(event) {
    const filterOpened = this.showFilterField !== '';
    if (filterOpened && !event.target.closest('.filter-list')) {
      this.showFilterField = '';
    }
  }

  fetchData() {
    this.data = [];
    this.loader = true;
    this._crmService
      .getCrmData(
        this.showTicketsAmount,
        this.currentPage,
        this.filters,
        'tickets'
      )
      .subscribe(
        (response) => {
          this.data = response.items;
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

  getFilters() {
    this.loader = true;
    this._crmService.getCrmFilters('tickets').subscribe((filters) => {
      this.crmFilters = filters;

      this.editTicketsFields = [
        {
          name: 'Status',
          fieldName: 'status_id',
          options: this.crmFilters.statuses,
        },
        {
          name: 'Agent',
          fieldName: 'manager_id',
          options: this.crmFilters.assigned_ams,
        },
      ];
    });
  }

  handleSearchStringChange() {
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

  handleSort(field) {
    if (!this.filters.sort || this.filters.sort.indexOf(field) === -1) {
      this.sortDirection = true;
    } else {
      this.sortDirection = !this.sortDirection;
    }
    this.filters.sort = this.sortDirection ? field : `-${field}`;
    this.fetchData();
  }

  handleFilterChange(field, val) {
    const index = this.filters[field].indexOf(val);
    if (index !== -1) {
      this.filters[field].splice(index, 1);
    } else {
      this.filters[field].push(val);
    }
    this.fetchData();
  }

  showFilter(field) {
    this.showFilterField = field;
  }

  handlePageChange(i) {
    this.currentPage = i + 1;
    this.fetchData();
  }

  checkTicket(id) {
    const index = this.checkedTickets.indexOf(id);
    if (index !== -1) {
      this.checkedTickets.splice(index, 1);
    } else {
      this.checkedTickets.push(id);
    }
  }

  handleActionBtnClick() {
    this.ticketEdit.openModal(this.checkedTickets, this.editTicketsFields);
  }

  handleAddEntryBtnClick() {
    this.addTicket.openModal();
  }

  handleDeleteBtnClick(id) {
    this.activeTicketId = id;
    this.confirmModal.openModal();
  }

  handleSendEmailBtnClick(ticket: Ticket) {
    this.activeTicketId = ticket.id;
    this.activeEmail = ticket.email;
    console.log(this.activeEmail);
    setTimeout(() => {
      this.sendEmail.openModal();
    });
  }

  handleViewPostClick(postId: string) {
    this.viewPostComponent.openModal(postId);
  }

  handleViewStoryClick(ticket: Ticket) {
    this.activeTicketId = ticket.id;
    setTimeout(() => {
      this.viewStory.openModal();
    });
  }

  deleteTicket(ticketId) {
    this._crmService.deleteTicket(ticketId).subscribe(
      () => {
        this.activeTicketId = null;
        this.fetchData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleEmailCreated() {
    this.toastService.success('Email sent successfully');
    this.activeEmail = null;
    this.activeTicketId = null;
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
      ids: this.checkedTickets,
    };

    if (this.checkedTickets.length > 0) {
      this._crmService.deleteTickets(payload).subscribe(
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
