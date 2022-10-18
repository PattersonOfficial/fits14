import { Component, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { BeforeAfterService } from "./before-after.service";
import { ModalDirective } from 'ngx-bootstrap/modal';

import { StorageService } from "../../../../../../services/auth/storage.service";
import { User } from '../../../../../../models/user/user.model';


@Component({
  selector: 'app-before-after',
  templateUrl: './before-after.component.html',
  styleUrls: ['./before-after.component.css'],
})

export class BeforeAfterComponent {

  public user: User;
  public background: string;
  public images: any[];
  public date: string;
  @ViewChild('modalGallery', {static: false}) modalGallery: ModalDirective;

  @Input() public uid: number;
  @Input() public client_id: number;

  constructor(
    public _storageService: StorageService,
    public _beforeAfterService: BeforeAfterService,
    private _sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.getImagesState(this.client_id);
  }


  getUser(id: number) {
    // this._metersService.getUser(id).subscribe(
    //   data => {
    //     console.log(data);
    //     this.user = data
    //   }
    // )
  }


  getImagesState(id) {
    this._beforeAfterService.getImagesState(id).subscribe(
      data => {

        console.log(data);
        this.images = data;
      }
    )
  }

  openImage(item) {
    console.log(item)
    this.date = item.created_at;
    this.background = item.image;
    this.modalGallery.show();
  }


  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }


}
