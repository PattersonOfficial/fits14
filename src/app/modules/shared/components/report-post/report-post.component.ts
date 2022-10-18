import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CrmService} from '../../../../services/crm/crm.service';
import {Reason} from '../../../../models/crm/repot-reason.model';
import {StorageService} from '../../../../services/auth/storage.service';
import {Ticket} from '../../../../models/crm/support-ticket.model';

@Component({
  selector: 'app-report-post',
  templateUrl: './report-post.component.html',
  styleUrls: ['./report-post.component.css']
})
export class ReportPostComponent implements OnInit {

  onHidden: EventEmitter<ModalDirective>;

  public loader = false;
  public postId: string;
  public isModal = false;
  public reasons: Reason[];
  public currentReason: Reason;
  public needComment = false;
  public comment: string;
  public minLength: number;
  public reportSent = false;
  public serverError = false;

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
      private _crmService: CrmService,
      private _storageService: StorageService,
  ) {
    this.minLength = 20;
  }

  ngOnInit() {

  }

  hideModal(): void {
    this.isModal = false;
  }

  public openModal(postId): void {
    this.postId = postId;
    this.isModal = true;
    this.clearAll();
    this.getReportReasonsList();
  }

  public clearAll() {
    this.loader = false;
    this.reasons = undefined;
    this.currentReason = undefined;
    this.needComment = false;
    this.comment = undefined;
    this.reportSent = false;
    this.serverError = false;
  }

  public getReportReasonsList() {
    this._crmService.getReportReasons().subscribe(data => {
      this.loader = false;
      this.reasons = [...data];
    }, () => {
      this.serverError = true;
      this.loader = false;
    });
    // setTimeout(() => {
    //   this.reasons = [
    //     {id: 1, title: 'Violence'},
    //     {id: 2, title: 'Nudity'},
    //     {id: 3, title: 'False information'},
    //     {id: 4, title: 'Spam'},
    //     {id: 5, title: 'Hate speech'},
    //     {id: 6, title: 'Disrespectful'},
    //     {id: 7, title: 'Racism'},
    //     {id: 8, title: 'Other'},
    //   ];
    //   this.loader = false;
    //   console.log(this.reasons, this.postId, this.isModal, this.loader);
    // }, 500);
  }

  public validateForm() {
    this.needComment = (this.currentReason.is_comment_allowed && (this.comment === undefined || (this.comment.length < this.minLength)));
  }

  public handleSubmit() {
    this.loader = true;

    const report = new Ticket();

    report.client_id = this._storageService.getCurrentUser().client.id.toString();
    report.source_id = 2;
    report.post_id = this.postId;
    report.comment = this.currentReason.is_comment_allowed ? this.comment : this.currentReason.name;

    this._crmService.createNewTicket(report).subscribe(() => {
      this.loader = false;
      this.reportSent = true;
    }, () => {
      this.serverError = true;
      this.loader = false;
    });
    // setTimeout(() => {
    //   this.loader = false;
    //   this.reportSent = true;
    // }, 500);
  }

}
