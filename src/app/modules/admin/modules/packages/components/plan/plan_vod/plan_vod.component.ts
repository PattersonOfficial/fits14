import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
// ---------------Angular Material CDK Drag&Drop--------
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
// ---------------Services------------------------------
import { VodService } from '../../../../../../../services/vod/vod.service';
import { AdministratorsService } from '../../../../users/components/administrators/administrators.service';
// ---------------Models--------------------------------
import { VodProgram } from '../../../../../../../models/vodprogram/vodprogram.model';
import { Contents } from '../../../../../../../models/contents/contents.model';
import { Memberships } from '../../../../../../../models/memberships/memberships.model';
import { Types } from '../../../../../../../models/types/types.model';
import {PlanService} from '../plan.service';
import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {BuilderService} from '../../builder/builder.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CropperComponent} from 'angular-cropperjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-plan_vod',
  templateUrl: './plan_vod.component.html',
  styleUrls: ['./plan_vod.component.css']
})

export class PlanVodComponent implements OnInit {

  public contents: Contents[];
  public temp = [];
  public programs: VodProgram[];
  public singleProgram: VodProgram;
  public memberships: Memberships;
  public programLessonsInserted = [];
  public programArticlesInserted = [];
  public dropdownList = [];
  public lessons: any[];
  public articles: any[];
  public mentors: any[];
  public editorConfig = {
    autoUpdateElement: true,
    language: 'en',
  };
  public errors = [];
  public activeTab: string;
  public thumbToFormData: FormData;
  public httpEvent: HttpEvent<any>;
  public progress: number;
  public thumbnail: File[];
  public cropperConfig = {
    movable: true,
    scalable: true,
    zoomable: true,
    viewMode: 0,
    aspectRatio: 16 / 9
  };
  public showCropper = false;
  public thumbnailUrl: SafeUrl;
  public thumbFileName: string;
  public loadingThumb = false;
  public loadingData = false;
  public loadingPrograms = false;

  @ViewChild('thumbnailImageCropper', {static: false}) public thumbnailImageCropper: CropperComponent;
  @ViewChild('thumbnailFileInput', {static: false}) public thumbnailFileInput: ElementRef;

  constructor(
      public _vodService: VodService,
      public _planService: PlanService,
      public _adminService: AdministratorsService,
      public _router: Router,
      public _builderService: BuilderService,
      private sanitizer: DomSanitizer,
    ) {
   this.singleProgram = new VodProgram();
   this.activeTab = 'lessons';
}

  ngOnInit() {
    this.getPrograms();
    this.dropdownList = [];
    this.getData();
    this.getMentors();
  }

  public getPrograms(): void {
    this.loadingPrograms = true;
    this._vodService.getVodPrograms().subscribe(
      data => {
        this.programs = data || [];
        // console.log(this.programs);
        this.loadingPrograms = false;
      }
    );
  }

  public getMentors(): void {
    this._adminService.getUsers('4').subscribe(mentors => {
      this.mentors = mentors;
    });
  }

  public postProgram(): void {
    this.errors = [];
    this.singleProgram.lessons = this.programLessonsInserted.map(less => less.id);
    this.singleProgram.articles = this.programArticlesInserted.map(less => less.id);

    if (!this.singleProgram.title) {
      this.errors.push('title');
    }
    if (this.singleProgram.lessons.length < 1) {
      this.errors.push('lessons');
    }
    if (this.singleProgram.articles.length < 1) {
      this.errors.push('articles');
    }
    if (!this.singleProgram.subtitle) {
      this.errors.push('subtitle');
    }
    if (!this.singleProgram.description) {
      this.errors.push('description');
    }
    if (!this.singleProgram.thumbnail) {
      this.errors.push('thumbnail');
    }
    if (!this.singleProgram.promo_video_url) {
      this.errors.push('promo video url');
    }
    if (!this.singleProgram.category_id) {
      this.errors.push('category');
    }
    if (!this.singleProgram.free_member_price) {
      this.errors.push('free member price');
    }
    if (!this.singleProgram.pro_member_price) {
      this.errors.push('pro member price');
    }
    if (!this.singleProgram.premium_member_price) {
      this.errors.push('premium member price');
    }

    // console.log(this.singleProgram);

    if (!this.errors.length) {
      if (this.singleProgram.id) {
        this._vodService.editVodProgram(this.singleProgram).subscribe(res => {
          this.afterProgramSaved();
        });
      } else {
        this._vodService.createVodProgram(this.singleProgram).subscribe(res => {
          this.afterProgramSaved();
        });
      }
    }
  }

  public afterProgramSaved() {
    this.singleProgram = new VodProgram();
    this.programLessonsInserted = [];
    this.programArticlesInserted = [];
    $("#delete_index").val('');
    this.getPrograms();
  }

  public removeLesson(index: any) {
    return this.programLessonsInserted.splice(index, 1);
  }

  public removeArticle(index: any) {
    return this.programArticlesInserted.splice(index, 1);
  }

  public programEdit(program_id_index): void {
   $("#delete_index").val(program_id_index);
    const programsContent = this.programs[program_id_index];
    this.singleProgram = programsContent;
    this._vodService.getVodProgramData(programsContent.id).subscribe(data => {
      // console.log(data)
      this.programLessonsInserted = data.lessons;
      this.programArticlesInserted = data.articles;
    });
  }

  public programDelete(): void {
    const delIndex: any = $("#delete_index").val();
    this._vodService.deleteVodProgram(this.programs[delIndex].id).subscribe(
      data => {
        this.getPrograms();
        this.singleProgram = new VodProgram();
        this.programLessonsInserted = [];
        this.programArticlesInserted = [];
      });
  }

  getData(): void {
    this.loadingData = true;
    this._planService.getContents(14).subscribe(data => {
      this.lessons = data.filter(item => item.type == 1);
      this.articles = data.filter(item => item.type == 4);
      // console.log(this.articles)
      this.loadingData = false;
    });
  }

  dropFromContainer(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  dropToContainer(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

  public changeComboThumbnailDropFile() {
    setTimeout(() => {
      this.uploadThumbnail();
    }, 2000);
  }

  public uploadThumbnail() {
    this.loadingThumb = true;

    this._builderService.uploadFiles(this.thumbToFormData).subscribe(
        upload => {
          this.httpEvent = upload;

          if (upload.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * upload.loaded / upload.total);
          }

          if (upload instanceof HttpResponse) {
            if (upload.body.length != 0) {
              this.singleProgram.thumbnail = upload.body[upload.body.length - 1].public_url;
            } else {
              this.singleProgram.thumbnail = '';
            }

            this.thumbnail = [];

            this.loadingThumb = false;

            this.showCropper = false;
            this.thumbnailUrl = null;
          }
        }
    );
  }

  // Cropper
  saveCroppedImage(cropperComponent, image_type) {
    if (cropperComponent) {
      this.loadingThumb = true;
      cropperComponent.cropper.getCroppedCanvas().toBlob((blob) => {

            const blobFile = new File([blob], this.thumbFileName);
            this.thumbnail = [];
            this.thumbnail.push(blobFile);
            setTimeout(() => {
              this.uploadThumbnail();
            }, 500);

          }, 'image/jpeg',
          0.75
      );
    }
  }

  cropperSetDragMode(cropperComponent: any, mode: string) {
    if (cropperComponent) {
      cropperComponent.cropper.setDragMode(mode);
    }
  }

  cropperDestroy(cropperComponent, imageType) {
    if (cropperComponent) {
      this[`${imageType}Url`] = undefined, this[`${imageType}CropperComponent`] = false;
    }
  }

  setCropper(input, type: string) {
    const file = input.files[0];
    if (file) {
      this.thumbnail = input.files;
      this.thumbFileName = file.name;
      this[`${type}CropperComponent`] = false;
      setTimeout(() => {
        this.thumbnailUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        // this[`${type}CropperComponent`] = true;
        this.thumbnailFileInput.nativeElement.value = '';
      }, 1);
    }

  }
}
