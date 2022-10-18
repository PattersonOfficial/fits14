import {Component, EventEmitter, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  modalRef: BsModalRef;
  isModal = false;

  @Output() onConfirm = new EventEmitter<string>();
  @Output() onDecline = new EventEmitter<string>();

  constructor(private modalService: BsModalService) {}

  public openModal(): void {
    this.isModal = true;
    // console.log(document.querySelector('.topside-bar, .leftside-bar'));
    document.querySelectorAll('.topside-bar, .leftside-bar').forEach(el => el['style'].zIndex = 'unset');
  }

  public hideModal(): void {
    this.isModal = false;
    document.querySelectorAll('.topside-bar, .leftside-bar').forEach(el => el['style'].zIndex = '12');
  }

  confirm(): void {
    this.onConfirm.emit();
    this.hideModal();
  }

  decline(): void {
    this.onDecline.emit();
    this.hideModal();
  }

}
