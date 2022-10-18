import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SupportEmail } from '../../../../../../models/crm/support-email.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CrmService } from '../../../../../../services/crm/crm.service';

@Component({
    selector: 'app-send-email',
    templateUrl: './send-email.component.html',
    styleUrls: ['../../../crm/components/add-lead/add-lead.component.css']
})
export class SendEmailComponent implements OnInit {
    isModal = false;
    loader = false;
    formFields: SupportEmail;
    touched = false;
    commentLength = false;
    emailToAdd = '';
    emailInvalid = false;
    invoiceID: any;

    onHidden: EventEmitter<ModalDirective>;

    constructor(
        private _crmService: CrmService,
    ) {
        this.clearEmail();
    }

    @ViewChild('modalRef', { static: false }) modalRef: ModalDirective;
    @Output() emailSaved = new EventEmitter<string>();
    @Input() email: string;
    @Input() userId: string;

    ngOnInit() {
    }

    clearEmail() {
        this.formFields = new SupportEmail();
    }

    hideModal() {
        this.isModal = false;
    }

    openModal(invoice_id) {
        if (invoice_id) {
            this.invoiceID = invoice_id;
        }
        this.formFields.emails = [this.email];
        this.isModal = true;
    }

    handleSubmit() {
        if (this.validateForm()) {
            this.createEmail();
        }
    }

    addEmail() {
        this.touched = true;

        // tslint:disable-next-line:max-line-length
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(String(this.emailToAdd).toLowerCase())) {
            this.emailInvalid = false;
            this.formFields.emails.push(this.emailToAdd);
            this.emailToAdd = '';
        } else {
            this.emailInvalid = true;
        }
    }

    validateForm() {
        this.touched = true;
        this.commentLength = this.formFields.comment && this.formFields.comment.length < 25;

        return !!(!this.commentLength && this.formFields.emails.length > 0 && this.formFields.subject && this.formFields.comment);
    }

    deleteEmail(index) {
        this.formFields.emails.splice(index, 1);
    }

    createEmail() {
        this.loader = true;
        this.formFields.invoice = this.invoiceID;
        this._crmService.sendEmailToUser(this.userId, this.formFields).subscribe(() => {
            this.emailSaved.emit('Email sent successfully.');
            this.clearEmail();
            this.loader = false;
            this.hideModal();
            this.touched = false;
        }, () => {
            this.loader = false;
        });
    }
}
