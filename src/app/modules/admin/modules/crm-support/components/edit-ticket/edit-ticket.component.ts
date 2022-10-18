import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {Ticket} from '../../../../../../models/crm/support-ticket.model';
import {ConfirmModalComponent} from '../../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['../../../crm/components/edit-user/edit-user.component.css']
})
export class EditTicketComponent implements OnInit {
  public isModal = false;
  public ticketslist: number[];
  public filters: any[];
  public editFields: any[];
  public showField: string;
  public checkedOptions: any;
  public loader = false;

  onHidden: EventEmitter<ModalDirective>;

  constructor(
      private _crmService: CrmService,
  ) {
    this.checkedOptions = {
      membership_id: '',
      status_id: '',
      manager_id: ''
    };
  }

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
  @ViewChild(ConfirmModalComponent, {static: false}) confirmModal: ConfirmModalComponent;
  @Output() ticketsEdited = new EventEmitter<string>();

  ngOnInit() {

  }

  public hideModal(): void {
    this.isModal = false;
  }

  public openModal(ticketsList, editFields): void {
    this.ticketslist = ticketsList;
    this.editFields = editFields;
    this.isModal = true;
  }

  public checkOption(field, val) {
    this.checkedOptions[field] === val ? this.checkedOptions[field] = '' : this.checkedOptions[field] = val;
  }

  public deleteTickets() {
    this.loader = true;
    const deletes = this.ticketslist.map(ticket => {
      return new Promise((res, rej) => {
        this._crmService.deleteTicket(ticket).subscribe(done => {
          res('Done');
        }, err => rej(err));
      });
    });
    Promise.all(deletes).then(() => {
      this.ticketsEdited.emit('Tickets are deleted');
      this.loader = false;
      this.hideModal();
    }).catch(fail => {
      console.log(fail);
      this.loader = false;
    });
  }

  public saveTicketsChanges() {
    this.loader = true;
    const ticketFields = new Ticket();
    if (this.checkedOptions.manager_id !== '') {
      ticketFields.manager_id = this.checkedOptions.manager_id;
    }
    if (this.checkedOptions.status_id !== '') {
      ticketFields.status_id = this.checkedOptions.status_id;
    }
    const updates = this.ticketslist.map(ticket => {
      return new Promise((res, rej) => {
        this._crmService.updateTicketData(ticketFields,  ticket).subscribe(done => {
          res('Done');
        }, err => rej(err));
      });
    });
    Promise.all(updates).then(() => {
      this.ticketsEdited.emit('Tickets are updated');
      this.hideModal();
    }).catch(fail => {
      console.log(fail);
      this.loader = false;
    });
  }

}
