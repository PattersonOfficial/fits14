import { FitnutsExperienceComponent } from './../../../../../shared/components/fitnuts-experience/fitnuts-experience.component';
import { ChangePlanComponent } from './../../../../../shared/components/change-plan/change-plan.component';
import { StorageService } from './../../../../../../services/auth/storage.service';
import { VodService } from './../../../../../../services/vod/vod.service';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { VgAPI } from 'videogular2/core';
import { Contents } from '../../../../../../models/contents/contents.model';
import { MatDialog } from '@angular/material/dialog';

import {
  GalleryService,
  Image,
  LineLayout,
  PlainGalleryConfig,
  PlainGalleryStrategy,
} from 'angular-modal-gallery';

import { WebViewService } from './webview.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

export class IMedia {
  title: string;
  src: string;
  type: string;
}

export class IImage {
  url: string | null;
  href: string;
  clickAction: Function;
  caption: string;
  title: string;
}

@Component({
  selector: 'webview-contents',
  templateUrl: './webview.component.html',
  styleUrls: ['./webview.component.css'],
})
export class WebViewComponent implements OnInit {
  public loadingContent: boolean = false;
  public isModal: boolean = false;
  public playlist: IMedia[];
  public images: Image[];
  public currentIndex: number = 0;
  public currentItem: IMedia;
  public api: VgAPI;
  public isReady: boolean;
  public height: string = '400px';
  public minHeight: string;
  public plainGalleryRow: PlainGalleryConfig;
  public section: any;
  public tab: any;

  @Input() content: Contents;
  @Output() newContent = new EventEmitter<string>();
  @ViewChild('modalViewRef', { static: false }) modalViewRef: ModalDirective;

  watchedTime = '';
  videoData: any;
  isOnDemand = true;
  videoType = 'video/mp4';

  constructor(
    public _webViewService: WebViewService,
    public galleryService: GalleryService,
    public _vodService: VodService,
    private spinner: NgxSpinnerService,
    public _router: Router,
    public _storageService: StorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isReady = false;
    this.content = new Contents();
    this.currentItem = new IMedia();
    this.playlist = [];
    this.images = [];
    this.content.data = [];
  }

  public modalHidden() {
    if (this.isOnDemand === false) {
      window['dataLayer'].push({
        event: 'My Videos',
        video_title: this.videoData ? this.videoData.title : '',
        video_time: this.watchedTime,
      });
    }

    this.content = new Contents();
    this.watchedTime = '';
    this.videoData = null;
    this.isOnDemand = false;
  }

  public playVideoByUrl(data) {
    this.isOnDemand = false;
    this.videoData = data;
    this.modalViewRef.show();
    this.loadingContent = true;
    this.content = new Contents();
    this.content.type = 1;
    this.addVideoToPlayList(data.aws_url ? data.aws_url : data.promo_video_url);
    this.currentItem = this.playlist[0];
    this.loadingContent = false;
    this.isReady = true;
  }

  public playVideoOnDemand(data) {
    this.isOnDemand = true;
    this.videoData = data;
    this.modalViewRef.show();
    this.loadingContent = true;
    this.content = new Contents();
    this.content.type = 1;
    this.addVideoToPlayList(
      data.promo_video_url ? data.promo_video_url : data.aws_url
    );
    this.currentItem = this.playlist[0];
    this.loadingContent = false;
    this.isReady = true;
  }

  splitType(data) {
    const urls = data.promo_video_url ? data.promo_video_url : data.aws_url;
    const url = urls.split('.');
    this.videoType = url[url.length - 1];
  }

 
  public openContent(item) {
    this.videoData = item;
    this.isOnDemand = false;

    if (item.type != 3) {
      this.modalViewRef.show();
    }

    this.loadingContent = true;
    this._webViewService.getContent(item).subscribe((content) => {
      this.loadingContent = false;
      this.content = content;

      if (this.content.data.length > 0) {
        if (content.type == 1) {
          this.getMedia(content.data);
          this.currentItem = this.playlist[0];
          this.currentIndex = 0;
        }

        if (content.type == 2) {
          this.getMedia(content.data);
          this.currentItem = this.playlist[0];
          this.currentIndex = 0;
        }

        if (content.type == 3) {
          this.getImages(content.data);
        }

        if (content.type == 4) {
        }

        this.isReady = true;
      }
    });
  }

  public getMedia(data) {
    this.playlist = [];
    for (var i = 0; i < data.length; i++) {
      let itemlist = new IMedia();
      itemlist.title = data[i].title;
      itemlist.src = data[i].content;
      itemlist.src = `${itemlist.src}#t=0.001`;
      itemlist.type = data[i].type;
      this.playlist.push(itemlist);
    }
  }

  public addVideoToPlayList(url) {
    this.playlist = [];

    const video = new IMedia();
    video.title = '';
    video.src = url;
    video.type = '';
    this.playlist.push(video);
  }

  public getImages(data) {
    this.images = [];

    for (var i = 0; i < data.length; i++) {
      let image = new Image(i, {
        img: data[i].content,
        extUrl: data[i].content,
        description: data[i].title,
      });

      this.images.push(image);
    }

    this.plainGalleryRow = {
      strategy: PlainGalleryStrategy.ROW,
      layout: new LineLayout(
        { width: '80px', height: '80px' },
        { length: this.images.length, wrap: true },
        'flex-start'
      ),
    };
  }

  
  onPlayerReady(api: VgAPI) {
    this.api = api;

    this.api
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
    this.api
      .getDefaultMedia()
      .subscriptions.ended.subscribe(this.nextVideo.bind(this));

    this.api
      .getDefaultMedia()
      .subscriptions.timeUpdate.subscribe((response) => {
        if (
          this.api.getDefaultMedia() &&
          this.api.getDefaultMedia().currentTime !== 0
        ) {
          const unix_timestamp = this.api.getDefaultMedia().currentTime;

          // multiply the unix_timestamp to get date
          const date = new Date(unix_timestamp * 1000);

          // Hours part from the timestamp
          const hours = date.getHours();

          // Minutes part from the timestamp
          const minutes = date.getMinutes();

          // Seconds part from the timestamp
          const seconds = date.getSeconds();

          // Add up all the other time
          const formattedTime = hours + ':' + minutes + ':' + seconds;

          this.watchedTime = formattedTime;
        }
      });
  }

  nextVideo() {
    this.currentIndex++;

    if (this.currentIndex === this.playlist.length) {
      this.currentIndex = 0;
    }

    this.currentItem = this.playlist[this.currentIndex];
  }

  playVideo() {
    this.api.play();
  }

  onClickPlaylistItem(item: IMedia, index: number) {
    this.currentIndex = index;
    this.currentItem = item;
  }

  openChat() {
    jQuery('#contact_box').toggleClass('opening');
  }

  onCancelPlayer() {
    this.isOnDemand = false;
    this.api.pause();
    this.modalViewRef.hide();
  }

  onCancel() {
    this.isOnDemand = false;
    this.modalViewRef.hide();
  }

  openProgram() {
    const user = this._storageService.getCurrentUser();
    if (user.client.membership.id === 4) {
      localStorage.setItem('program', JSON.stringify(this.videoData));
      this.onCancelPlayer();
      this.openDialogPlan();
    } else {
      this.addProgramToList();
    }
  }

  openDialogPlan() {
    this.dialog
      .open(FitnutsExperienceComponent)
      .afterClosed()
      .subscribe((resp) => {
        if (resp === true) {
          this.dialog
            .open(ChangePlanComponent, {
              data: 'VOD'
             })
            .afterClosed()
            .subscribe((resp) => {
              if (resp.success === true) {
                this.videoData = JSON.parse(localStorage.getItem('program'));
                this._storageService.refreshUserData();
                this.addProgramToList();
              }
            });
        }
      });
  }

  addProgramToList() {
    this.spinner.show();
    this._vodService.purchaseProgram(this.videoData).subscribe(
      () => {
        localStorage.removeItem('program');
        this.spinner.hide();
        this._router.navigate(['/board/u/vod/my-videos']);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
