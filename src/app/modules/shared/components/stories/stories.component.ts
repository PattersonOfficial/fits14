import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StoriesService } from './stories.service';
import { User } from '../../../../models/user/user.model';
import { StorageService } from '../../../../services/auth/storage.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserStory } from '../../../../models/story/userstory.model';
import { DomSanitizer } from '@angular/platform-browser';
import { FriendsData } from '../../../../models/story/friends-data.model';
import { takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  public user: User;
  public iconsCarouselOptions: {};
  public storiesCarouselOptions: {};
  modalRef: BsModalRef;

  public title = '';
  public message = '';
  public togglePost = false;
  public file: File;
  public accept: string;
  public userStoriesArchive: UserStory[] = [];
  public friendsData: FriendsData[] = [];
  public currentFriendId = null;
  public currentFriendStories: UserStory[] = [];
  public allUserStories = false;
  // ----------------------------------------
  formData: FormData;
  previewUrl;
  format;
  public friendsUid = [];
  public usersByUid = [];
  public userStoriesBy24Hours = [];
  public showStories = [];
  public showUsers = [];
  public storyCounter = 0;
  public bigFile = false;

  constructor(
    public storageService: StorageService,
    private firestore: AngularFirestore,
    public storiesService: StoriesService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    this.file = null;
    this.accept =
      'video/mp4,video/avi,video/wav,image/png,image/jpeg,image/jpg';
  }

  ngOnInit() {
    this.user = new User();
    this.user = this.storageService.getCurrentUser();
    this.getUserStoriesBy24Hours(this.user.id);
    this.getFriendsFromFirebase();

    this.firestore.collection('users').doc(this.user.firestore_uid).set(
      {
        status: 1
      },
      { merge: true }
    );

    this.storageService.isUserChanged.subscribe(user => {
      this.user = user;
    });

    this.iconsCarouselOptions = {
      dots: false,
      loop: false,
      nav: false,
      autoplay: false,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      margin: 10,
      responsive: {
        320: {
          items: 2,
          stagePadding: 10
        },
        600: {
          items: 4
        },
        940: {
          items: 7
        },
        1140: {
          items: 8
        },
        1240: {
          items: 10
        }
      }
    };

    this.storiesCarouselOptions = {
      items: 1,
      dots: true,
      loop: false,
      nav: true,
      autoplay: true,
      autoplayTimeout: 5000
    };
  }

  fetchData(data) {
    this.storiesService
      .getUserAndFriendsStoriesData(data)
      .subscribe(response => {
        this.userStoriesArchive = response['user_data'];
        this.friendsData = response['friends_data'].filter(
          friend => friend.count_new > 0
        );
        // console.log('friends stories', this.friendsData);
      });
  }

  getFriendStoriesById(id) {
    this.currentFriendId = id;
    this.storiesService.getFriendsStoriesById(id).subscribe(data => {
      this.currentFriendStories = data['friend_data'];
      console.log('user ', id, ' stories', data);
    });
  }

  getUserStoriesBy24Hours(id) {
    this.storiesService.getFriendsStoriesById(id).subscribe(data => {
      this.userStoriesBy24Hours = data['friend_data'];
      // console.log('user stories', this.userStoriesBy24Hours);
      if (this.userStoriesBy24Hours.length) {
        const user = {
          name: this.userStoriesBy24Hours[0].user_name,
          image: this.userStoriesBy24Hours[0].image,
          stories: []
        };
        this.showUsers.push(user);
        this.userStoriesBy24Hours
          .sort(function (a, b) {
            return a > b ? -1 : 1;
          })
          .forEach((story, index) => {
            story.index = index;
            this.showUsers
              .filter(item => item.name === story.user_name)[0]
              .stories.push(story);
            this.storyCounter = index;
            this.showStories.push(story);
          });
      }
    });
  }

  openModalWithClass(template: TemplateRef<any>, modalClass?: String) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign(
        {},
        {
          class: `gray modal-lg ${modalClass}`,
          width: '100%',
          maxWidth: '100%'
        }
      )
    );
  }

  addEmoji(event) {
    this.message = this.message + event.emoji.native;
  }

  openPickerPost() {
    this.togglePost = !this.togglePost;
  }

  upload(files: File[]) {
    this.formData = new FormData();
    if (files[0].size > 2000000) {
      this.bigFile = true;
    } else {
      this.bigFile = false;
      this.file = files[0];
      this.formData.append('file', this.file);
      this.createPreview();
    }
  }

  createPreview() {
    const reader = new FileReader();
    if (this.file) {
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = event => {
        this.previewUrl = (<FileReader>event.target).result;
      };
    }
  }

  sendStory() {
    this.formData.append('message', this.message);
    this.formData.append('title', this.title);
    if (this.formData) {
      this.storiesService
        .saveUserStory(this.formData)
        .pipe(takeLast(1))
        .subscribe(data => this.getUserStoriesBy24Hours(this.user.id));
    }
  }

  deleteStory(id) {
    this.storiesService
      .deleteUserStory(id)
      .subscribe(data => this.getUserStoriesBy24Hours(this.user.id));
  }

  clearStory() {
    this.modalRef.hide();
    this.allUserStories = false;
    this.cancel();
    if (this.message) {
      this.message = '';
    }
    if (this.title) {
      this.title = '';
    }
  }

  cancel() {
    if (this.file && this.previewUrl) {
      this.file = null;
      this.previewUrl = '';
    }
  }

  safeImageUrl(image) {
    if (image) {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    } else {
      return;
    }
  }

  getFriendsFromFirebase() {
    this.firestore
      .collection('users')
      .doc(this.storageService.getCurrentUser().firestore_uid)
      .collection('friends')
      .snapshotChanges()
      .subscribe(data => {
        data.forEach(elem => {
          if (elem.payload.doc.data().uid) {
            this.friendsUid.push(elem.payload.doc.data().uid);
          }
        });
        // console.log('firebase friends', data);
        this.getUsersByUid();
      });
  }

  getUsersByUid() {
    this.friendsUid.forEach(elem => {
      this.firestore
        .collection('users')
        .doc(elem)
        .valueChanges()
        .subscribe(data => {
          if (data) {
            // console.log(data)
            this.usersByUid.push(data['email']);
            if (this.usersByUid.length === this.friendsUid.length) {
              this.fetchData({ emails: this.usersByUid });
            }
          }
        });
    });
  }
}
