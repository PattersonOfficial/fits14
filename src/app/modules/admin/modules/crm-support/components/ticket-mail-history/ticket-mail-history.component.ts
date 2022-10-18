import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {TicketReply} from '../../../../../../models/crm/support-ticket-reply.model';

@Component({
  selector: 'app-ticket-mail-history',
  templateUrl: './ticket-mail-history.component.html',
  styleUrls: ['../../../crm/components/add-lead/add-lead.component.css']
})
export class TicketMailHistoryComponent implements OnInit {

  public isModal = false;
  public loader = false;
  public data: TicketReply[];

  onHidden: EventEmitter<ModalDirective>;

  constructor(
      private _crmService: CrmService,
  ) {}

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
  @Input() public ticketId: number;

  ngOnInit() {

  }

  public getHistory() {
    this.loader = true;
    this._crmService.getTicketMailHistory(this.ticketId).subscribe(history => {
      this.data = history;
      this.loader = false;
    }, err => {
      this.loader = false;
      console.log(err);
    });
  }

  public hideModal(): void {
    this.isModal = false;
  }

  public openModal(): void {
    this.getHistory();
    this.isModal = true;
  }

}
