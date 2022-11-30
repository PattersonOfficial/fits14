import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { StorageService } from "../../services/auth/storage.service";
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'modal-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit {

  public showLogin: boolean;

  @Input() isValid: boolean = true;
  @ViewChild('LoginComponent', {static: false}) loginRef: LoginComponent | any;
  @ViewChild('modalValidateRef', {static: false}) modalValidateRef: ModalDirective | any;

  constructor(
    public _storageService: StorageService
  ) {
    this.showLogin = false;
  }

  ngOnInit() {
    this._storageService.isValidAuth
        .subscribe((status) => {
              if (status) {
                this.showLogin = true;
                // this.modalValidateRef.show();
                location.reload();
              } else {
                this.showLogin = false;
                this.modalValidateRef.hide();
                location.reload();
              }
            }
        );
    }
  }
