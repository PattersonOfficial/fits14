import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { StorageService } from "../../../../services/auth/storage.service";
import { FitnessService } from "./fitness.service";

@Component({
  selector: 'app-client-fitness',
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.css']
})

export class FitnessComponent {

  public total: number;
  public finished: number;

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
    public _storageService: StorageService,
    public _fitnessService: FitnessService
  ) {
    this.total = 0;
    this.finished = 0;

  }

  ngOnInit() {
    this.getProgress();
  }

  getProgress() {
    this._fitnessService.getProgress().subscribe(
      (data) => {
        this.total = data.total;
        this.finished = data.finished;
      }
    )
  }


}
