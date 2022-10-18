import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, AfterViewInit} from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject ,  Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { MetersComponent } from '../meters/meters.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProgressService } from './progress.service';

import { QuestionsComponent } from '../../../../../shared/components/questions/questions.component';
import { StorageService } from '../../../../../../services/auth/storage.service';
import { User } from '../../../../../../models/user/user.model';
import {MatDialog} from '@angular/material/dialog';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-client-progress',
  // templateUrl: './progress.component.html',
  templateUrl: './progress-new.component.html',
  styleUrls: ['./progress.component.css'],
})

export class ProgressComponent implements OnInit, AfterViewInit {

  public user: User;
  public date: string;
  public loadingBox: boolean;
  public tab: string;
  public accept: string;
  public maxSize: number = 500024;
  public files: File[];
  public images: any[];
  public progress: number;
  public toFormData: FormData;
  public httpEmitter: Subscription;
  public httpEvent: HttpEvent<any>;
  public background: string;

  dragFiles: any;
  validComboDrag: any;

  @ViewChild(QuestionsComponent, {static: false}) questionsRef: QuestionsComponent;
  @ViewChild(MetersComponent, {static: false}) meters: MetersComponent;
  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
  @ViewChild('modalGallery', {static: false}) modalGallery: ModalDirective;
  constructor(
    public _storageService: StorageService,
    public _route: ActivatedRoute,
    public _progressService: ProgressService,
    public _router: Router,
    private _sanitizer: DomSanitizer,
    private _firestore: AngularFirestore,
    public dialog: MatDialog
  ) {
    this.loadingBox = false;
    this.tab = 'meters';

    this.images = [];
    this.files = [];
    this.accept = '.png,.jpg,.gif,.jpeg,image/*';

  }

  ngOnInit() {
    this.user = new User();
    this.user = this._storageService.getCurrentUser();

    this._firestore.collection('users').doc(this.user.firestore_uid).set({
      status: 1
    }, { merge: true });

    this._storageService.isUserChanged
      .subscribe((user) => {
        this.user = user;
      });

    this.getImagesState();
    jQuery('#main-container').removeClass('opening');
    jQuery('#side_navbox').removeClass('opening');
    jQuery('#right-sidebar').removeClass('opening');
    jQuery('#footer-margin').removeClass('opening');
  }
  // -------Questionnaire Modal----------
  openDialogQuestions() {
    this.dialog.open(QuestionsComponent, {
      width: '100vw',
      height: '100vh',
      // maxWidth: '100vw',
      hasBackdrop: false
    });
  }
  ngAfterViewInit() {
    if (this.user.client.weight <= 0 && this.user.client.height <= 0) {
      setTimeout( () => {
        this.openDialogQuestions();
      }, 10);
    }
  }

  // -------If exist uploaded photos----------
  openImage(item) {
    this.date = item.created_at;
    this.background = item.image;
    this.modalGallery.show();
  }
  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  /**
   * Abre modal para carga de archivos adjuntos en publicación
   *
   * @return void
   */
  openModalAttach() {
    this.modalRef.show();
  }

  /**
   * Es lanzado cuando se inserta un nuevo archivo a la cola de subida
   *
   * @return void
   */
  public changeComboDropFile() {
    this.progress = 0;
  }


  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadFiles(files: File[]): Subscription {
    this.progress = 0;
    return this.httpEmitter = this._progressService.uploadFiles(this.toFormData).subscribe(
      upload => {

        this.httpEvent = upload;
        if (upload.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * upload.loaded / upload.total);
        }
        if (upload instanceof HttpResponse) {
          delete this.httpEmitter;
          this.saveImage(upload.body.url);
          this.files = [];
          // this.post.source = upload.body.url;
          this.modalRef.hide();
        }
      },
      error => {

      }
    );
  }


  saveImage(image) {
    const object = {
      url: image,
      client_id: this.user.client.id
    };
    this._progressService.sendImage(object).subscribe(
      data => {
        this.getImagesState();
      }
    );
  }

  getImagesState() {
    this._progressService.getImagesState().subscribe(
      data => {
        this.images = data;
      }
    );
  }

  closeModal() {
    this.modalRef.hide();
    this.files.length = 0;
  }

}
