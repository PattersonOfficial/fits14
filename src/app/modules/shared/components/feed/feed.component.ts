import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable ,  Subject ,  Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {map, take} from 'rxjs/operators';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as moment from 'moment';

import { FeedService } from './feed.service';
import { StorageService } from '../../../../services/auth/storage.service';

import { User } from '../../../../models/user/user.model';
import {Feed} from '../../../../models/feed/feed.model';
import {EditTicketComponent} from '../../../admin/modules/crm-support/components/edit-ticket/edit-ticket.component';
import {ReportPostComponent} from '../report-post/report-post.component';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-client-feed',
  templateUrl: './feed-new.component.html',
  styleUrls: ['./feed.component.css']
})

export class FeedComponent implements OnInit {
  private _feedUserId: string;
  get feedUserId(): string {
    return this._feedUserId;
  }
  @Input()
  set feedUserId(val: string) {
    this._feedUserId = val;
    this.listCookiesResources();
  }

  @Input() isProfile: boolean;
  @Input() canComment: boolean;

  @ViewChild(ReportPostComponent, {static: false}) reportPost: ReportPostComponent;
  @ViewChild(ConfirmModalComponent, {static: false}) confirmModal: ConfirmModalComponent;

  public loadingBox = false;
  private user: User;
  public mesagges: Observable<any[]>;
  public feed: Observable<any[]>;
  public test: Observable<any[]>;
  public current_post: string;

  public accept: string;
  public maxSize = 500024;
  public files: File[];
  public progress: number;
  public toFormData: FormData;
  public httpEmitter: Subscription;
  public httpEvent: HttpEvent<any>;
  public loadingAws: boolean;
  public content: string;
  public post;
  public comment: any = {};
  public requirements: any[];
  public isMe = true;

  public togglePost = false;
  public toggleComment = {};
  public togglePostAction = {};
  public commentsLengthToDisplay = 2;
  public renderFeed: Feed[] = [];
  public feedSubscription: Subscription;
  public deletePostId: string;
  public bigFile = false;

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
    private _friendsService: FeedService,
    public _feedService: FeedService,
    public _storageService: StorageService,
    private afs: AngularFirestore,
    private _cookieService: CookieService
  ) {
    
    this.post = {
      uid: '',
      content: '',
      date: '',
      last_update: '',
      type: '',
      source: ''
    };

    this.requirements = [];
    this.current_post = '0';
    this.post.type = 'post_text';
    this.loadingAws = false;
    this.files = [];
    this.accept = '.mp4,.3gp,.avi,video/*,video/mp4,.png,.jpg,.gif,.jpeg,image/*';
  }




  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    this.listCookiesResources();
    this.getRequirements();
    // console.log('isFriend: ', this.canComment)
  }

  /**
   * Abre modal para carga de archivos adjuntos en publicación
   *
   * @return void
   */
  openModalAttach(type) {
    this.post.type = type;
    this.modalRef.show();
    document.querySelectorAll('.topside-bar, .leftside-bar').forEach(el => el['style'].zIndex = 'unset');
  }

  /**
   * Abre picker de Emoji en input de post
   *
   * @return void
   */
  openPickerPost() {
    this.togglePost = !this.togglePost;
  }

  /**
   * Abre picker de Emoji en comentarios
   *
   * @return void
   */
  openPickerComments(id) {
    this.toggleComment[id] = !this.toggleComment[id];
  }

  /**
   * Agrega Emoji a input de post
   *
   * @return void
   */
  addEmoji(event) {
    // console.log(event);
    this.post.content = this.post.content + event.emoji.native;
  }

  /**
   * Agrega Emoji a input de comentarios
   *
   * @return void
   */
  addEmojiComment(event, id) {
    // console.log(event);
    this.comment[id] += event.emoji.native;
  }

  /**
   * Envia post a Firestore y lo relaciona con los amigos del usuario
   *
   * @return void
   */

  publish() {
    if (this.user.firestore_uid !== this.feedUserId) {
      return;
    }

    const date = moment().format('MM/DD/YYYY HH:mm:ss');
    this.post.uid = this.user.firestore_uid;
    this.post.date = date;
    const post = this.post;
    
    if (post.content.length !== 0) {
      this._feedService.addPost(post).then(docRef => {
        const relationship = {
          created_at: date,
          post_id: docRef.id
        };

        this._feedService.getMyFriends(this.user.firestore_uid).snapshotChanges().subscribe((catsSnapshot) => {
          catsSnapshot.forEach((catData: any) => {
            this._feedService.getPostsUser(catData.payload.doc.data().uid).add(relationship);
          });
        });

        this._feedService.getPostsUser(this.feedUserId || this.user.firestore_uid).add(relationship);
      });

      this.post = {
        uid: '',
        content: '',
        date: '',
        last_update: '',
        type: 'post_text',
        source: ''
      };

      this.files = [];
    }
  }

  /**
   * Envia comentario de post
   *
   * @return void
   */
  sendComment(id) {
    const comment = {};
    comment['created_at'] = moment().format('MM/DD/YYYY HH:mm:ss');
    comment['uid'] = this.user.firestore_uid;
    comment['message'] = this.comment[id];
    if (comment['message'].length !== 0) {
      this._feedService.getPosts().doc(id).collection('comments').add(comment);
      this.comment[id] = '';
    }
  }

  /**
   * Envia like de post
   *
   * @return void
   */
  setLikePost(id) {
    const likeId = this._feedService.itLiked.indexOf(id);
    if (likeId === -1) {
      this._feedService.getPosts().doc(id).collection('likes').add({
        'uid': this.user.firestore_uid,
        'created_at': moment().format('MM/DD/YYYY HH:mm:ss')
      });
    } else {
      this._feedService
          .getPosts()
          .doc(id)
          .collection('likes', ref => ref.where('uid', '==', this.user.firestore_uid))
          .snapshotChanges()
          .pipe(map(documents => {
            documents.map(document => {
              this._feedService.getPosts()
                  .doc(id)
                  .collection('likes')
                  .doc(document.payload.doc.id).delete();
            });
          })).pipe(take(1)).subscribe();

      this._feedService.itLiked.splice(likeId, 1);
    }
  }

  /**
   * Es lanzado cuando se inserta un nuevo archivo a la cola de subida
   *
   * @return void
   */
  public changeComboDropFile(files) {
    this.progress = 0;
    this.checkFileSizes(files);
  }

  public  checkFileSizes(files) {
    let foundBig = false;
    files.forEach(file => {
      if (file.size > 2000000) {
        foundBig = true;
      }
    });
    this.bigFile = foundBig;
  }

  setCurrentPost(id) {
    if (this.current_post == id) {
      this.current_post = '0';
    } else {
      this.current_post = id;
    }

    this.comment[id] = '';
  }

  getRequirements() {
    this._feedService.listFriendsRequirements().subscribe(
      data => {
        this.requirements = data;
      }
    );
  }

  declineRequirement(requirement) {
    this._feedService.declineFriend(requirement).subscribe(
      data => {
        this.getRequirements();
      }
    );
  }

  listCookiesResources() {
    if (this.user) {
      this.isMe = this._feedUserId === this.user.firestore_uid;
    }
    this._feedService.listCookiesResources().subscribe(
      data => {
        this.getFeedUser();
      }
    );
  }




  acceptRequirement(requirement) {
    this._feedService.getMyFriends(this.user.firestore_uid).add({
      uid: requirement.user.firestore_uid,
      updated_at: moment().format('MM/DD/YYYY HH:mm:ss'),
      pendings: 0
    });

    this._feedService.getMyFriends(requirement.user.firestore_uid).add({
      uid: this.user.firestore_uid,
      updated_at: moment().format('MM/DD/YYYY HH:mm:ss'),
      pendings: 0
    });
    this.declineRequirement(requirement);
  }



  /**
   * Feed de usuario loggueado
   *
   * @return void
   */
  getFeedUser() {
    const uid = this._feedUserId || this.user.firestore_uid;
    this._feedService.getInitFeed(uid);

    if (this.feedSubscription) {
      this.feedSubscription.unsubscribe();
    }

    this.feedSubscription = this._feedService.data.subscribe(feed => {
      let isEmptyFeed = true;
      let resultFeed;

      feed.forEach(item => {
        if (isEmptyFeed && item !== undefined) {
          isEmptyFeed = false;
        }
      });

      if (isEmptyFeed) {
        resultFeed = [];
      } else {
        resultFeed = feed.filter(item => item !== undefined);
        resultFeed.forEach((item, i) => {
          // console.log(item.user)
          if (!item.user.email) {
            item.user.subscribe(data => {
              resultFeed.forEach(post => {
                if (post && post.id === item.id) {
                  post.user = data;
                }
              });
            });
          }
        });
        if (!this.isMe || this.isProfile) {
          resultFeed = feed.filter(item => item !== undefined).filter(item => item.uid === uid);
        }
      }

      this.renderFeed = resultFeed;
      // console.log(this.isProfile, uid, this.renderFeed)
    });
  }

  /**
   * Carga más post al hacer scroll con mouse en widget Feed
   *
   * @return void
   */
  scrollHandler(e) {
    if (e === 'bottom') {
      this._feedService.lastPostsFeed(this.user.firestore_uid);
    }
  }


  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadFiles(files: File[]): Subscription {
    this.progress = 0;
    this.loadingAws = true;
    return this.httpEmitter = this._feedService.uploadFiles(this.toFormData).subscribe(
      upload => {
        console.log(upload);
        this.httpEvent = upload;
        if (upload.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * upload.loaded / upload.total);
        }
        if (upload instanceof HttpResponse) {
          delete this.httpEmitter;
          // console.log(upload);
          this.post.source = upload.body.url;
          this.loadingAws = false;
          this.modalRef.hide();
        }
      },
      error => {

      }
    );
  }

  public handleHidden() {
    document.querySelectorAll('.topside-bar, .leftside-bar').forEach(el => el['style'].zIndex = '12');
  }

  public handlePostActionClick(id) {
    this.togglePostAction[id] = !this.togglePostAction[id];
  }

  public handleReportPostClick(post) {
    console.log(post);
    this.reportPost.openModal(post.id);
  }

  public handleDeletePostClick(post) {
    this.deletePostId = post.id;
    this.confirmModal.openModal();
  }

  public handleDeletePost() {
    // this._feedService.deletePostById(this.deletePostId);
    this._feedService.deletePostById(this.deletePostId).then((res) => console.log(res, `post deleted`));
    this.deletePostId = null;
  }

  public handleReportPostSent(e) {
    console.log(e);
  }
}
