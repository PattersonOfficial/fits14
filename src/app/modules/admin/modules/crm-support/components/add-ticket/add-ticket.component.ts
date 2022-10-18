import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {Ticket} from '../../../../../../models/crm/support-ticket.model';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['../../../crm/components/add-lead/add-lead.component.css']
})
export class AddTicketComponent implements OnInit {

  public isModal = false;
  public isError = false;
  public loader = false;
  public formFields: Ticket;
  public touched = false;
  public commentLength = false;
  public errorMessage = 'Please fill all fields correctly and with valid information especially the email and phone number';

  @ViewChild('phone', {static: false}) phone: ElementRef;

  onHidden: EventEmitter<ModalDirective>;

  constructor(
      private _crmService: CrmService,
  ) {
    this.clearTicket();
  }

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
  @Output() ticketSaved = new EventEmitter<string>();
  @Input() public managersList: any[];

  ngOnInit() {
    // console.log(this.managersList);
  }

  public telInputObject(obj) {
    obj.setCountry('il');
  }

  public clearTicket() {
    const ticket = new Ticket();
    this.formFields = ticket;
  }

  public hideModal(): void {
    this.isModal = false;
  }

  public openModal(): void {
    this.isModal = true;
  }



  public handleSubmit() {
    const isValid = this.validateForm();
    if (isValid) {
      this.createTicket();
    } else {
      this.isError = true;
    }
  }

  public validateForm() {
    this.touched = true;
    this.commentLength = this.formFields.comment.length < 25;
    return !!(this.formFields.name
        && !this.commentLength
        && this.formFields.email
        && this.formFields.phone
        && this.formFields.comment);
  }

  public createTicket() {
    this.loader = true;
    this._crmService.createNewTicket(this.formFields).subscribe(res => {
      this.isError = false;
      this.ticketSaved.emit('Ticket Saved');
      this.clearTicket();
      this.loader = false;
      this.hideModal();
      this.touched = false;
    }, err => {
      console.log(err);
      this.isError = true;
      this.loader = false;
    });
  }

  public onCountryChange(country) {
    if (this.phone && this.phone.nativeElement) {
      this.formFields.phone = this.phone.nativeElement.value;
    }
  }

}
