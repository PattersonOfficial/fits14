import { StorageService } from './../../../../../../services/auth/storage.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VodService } from '../../../../../../services/vod/vod.service';
import { VodProgram } from '../../../../../../models/vodprogram/vodprogram.model';
import { User } from '../../../../../../models/user/user.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Contents } from '../../../../../../models/contents/contents.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-myvideos',
  templateUrl: './my-videos.component.html',
  styleUrls: ['./my-videos.component.css'],
})
export class MyVideosComponent implements OnInit {
  public loading: boolean;
  public programsList: VodProgram[];
  public morePrograms: VodProgram[];
  public activeProgramId: number;
  public activeContentId: number;
  public activeContentType: number;
  public activeContent: Contents;
  public activeProgramData: VodProgram;
  private history: string[] = [];

  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();
  @Input() user: User;
  @Output() onShowPaymentModal: EventEmitter<any> = new EventEmitter();
  @Output() onSubscribeVod: EventEmitter<any> = new EventEmitter();
  

  constructor(
    public _vodService: VodService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _storageService: StorageService,
    private location: Location
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this._storageService.refreshUserData();
    this._route.params.subscribe((params) => {
      if (params.programId !== undefined) {
        this.handleActiveProgram(params.programId);
        this.activeContentId = params.contentId;
        this.activeContentType = params.contentType;
      }
    });
    this.loading = true;
    this._vodService.getUserSubscriptions().subscribe((data) => {
      this.programsList = data;
      this.loading = false;
    });
    this.loading = true;
    this._vodService.getMorePrograms().subscribe((data) => {
      this.morePrograms = data;
      this.loading = false;
    });
  }

  public handleActiveProgram(id) {
    this.isObject(id)
      ? this._router.navigate([
          'board/u/vod',
          'my-videos',
          id.pivot.vod_program_id,
          id.id,
          1,
        ])
      : this.notObject(id);
  }

  public notObject(id) {
    this._vodService.getVodProgramData(id).subscribe((data) => {
      this.activeProgramData = data;
      this.activeProgramId = id;
      this.loading = false;
      if (this.activeContentId && this.activeContentType) {
        this.activeContent =
          this.activeContentType == 1
            ? this.activeProgramData.lessons.find(
                (item) => +item.id === +this.activeContentId
              )
            : this.activeProgramData.articles.find(
                (item) => +item.id === +this.activeContentId
              );
      }
    });
  }

  public isObject(data) {
    return data instanceof Object;
  }

  public resetActiveProgram() {
    this.activeProgramData = null;
    this.activeProgramId = null;
  }

  public handlePlayVideo(data) {
    this.onPlayVideo.emit(data);
  }

  public previousPage() {
    if (this._router.navigated) {
      this.location.back();
    } else {
      this._router.navigate(['/board/u/vod/my-videos']);
    }
  }

  public handlePaymentFormModal(data) {
    this.onShowPaymentModal.emit(data);
  }

  public handleProgramSubscription(data) {
    // console.log({ onSubscribeDemand: data });
    this.onSubscribeVod.emit(data);
  }
}
