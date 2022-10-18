import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { ProgramsService } from "./programs.service";
import { ModalDirective } from 'ngx-bootstrap/modal';

import { StorageService } from "../../../../../../services/auth/storage.service";
import { User } from '../../../../../../models/user/user.model';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css'],
})

export class ProgramsComponent implements OnInit {

  public user: User;
  public myPrograms: any[];

  @ViewChild('modalGallery', {static: false}) modalGallery: ModalDirective;

  @Input() public uid: number;
  @Input() public client_id: number;

  constructor(
    public _storageService: StorageService,
    public _programsService: ProgramsService,
  ) {
    this.myPrograms = [];
  }

  ngOnInit() {
    this.getPrograms(this.client_id);
  }

  public getPrograms(uid) {
    this._programsService.getPrograms(uid).subscribe(
      data => {
        this.myPrograms = data['types'];
      }
    );
  }

}
