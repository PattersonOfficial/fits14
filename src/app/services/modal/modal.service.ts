import { EventEmitter, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ModalService {
 
  modalOpened = new EventEmitter<boolean>();
  modalClosed = new EventEmitter<any>();

  constructor() {}

  openModal(program: any) {
    this.modalOpened.emit(program);
  }

  closeModal(data: any) {
    this.modalClosed.emit(data);
  }
}
