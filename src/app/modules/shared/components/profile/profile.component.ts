import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {StorageService} from '../../../../services/auth/storage.service';
import {User} from '../../../../models/user/user.model';
import {Memberships} from '../../../../models/memberships/memberships.model';
import * as countries from 'i18n-iso-countries';
import {BuilderService} from '../../../admin/modules/users/components/builder/builder.service';
import {StoriesService} from '../stories/stories.service';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Contacts, Friends} from '../../../../models/user/friends.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {FriendsService} from '../friends/friends.service';
import {Global} from '../../../../app.global';
import {ContentsService} from '../../../admin/modules/packages/components/contents/contents.service';
import {Contents} from '../../../../models/contents/contents.model';
import {DomSanitizer} from '@angular/platform-browser';
import {WebViewComponent} from '../../../admin/modules/packages/components/webview/webview.component';
import {FeedService} from '../feed/feed.service';
import {MyprogramService} from '../../../client/modules/myprogram/components/myprogram/myprogram.service';

@Component({
    selector: 'app-client-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
    private _userId: string;

    get userId(): string {
        return this._userId;
    }

    @Input()
    set userId(val: string) {
        this._userId = val;
        this.getUserDetails();
    }
    @ViewChild(WebViewComponent, {static: false}) webview: WebViewComponent;
    @Input() feedUserId: number;

    public memberships: Memberships;
    public user: User;
    public loggedUser: User;
    public country: string;
    public friendsCount: number;
    public hasActiveStories = false;
    public isMe = true;
    public canAdd = false;
    public friends: Observable<Friends[]>;
    public currentFriendsList = [];
    public isRequestSent = false;
    public friendsRequests = [];
    public isFriend = false;
    public clientTypes: any = {};
    mentorVideoList: Contents[];
    mentorArticleList: Contents[];

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _storageService: StorageService,
        public _builderService: BuilderService,
        public _storiesService: StoriesService,
        public _firestore: AngularFirestore,
        public _friendsService: FriendsService,
        public _contentsService: ContentsService,
        private _sanitizer: DomSanitizer,
        private _feedService: FeedService,
        private _myprogramService: MyprogramService,
    ) {

    }

    ngOnInit() {
        this._storageService.isUserChanged.subscribe(loggedUser => this.updateLoggedUser(loggedUser));
        this.getUserDetails();
    }

    getUserDetails() {
        this.getUser(this._userId);
        this.getStories(this._userId);
    }

    updateLoggedUser(loggedUser: User) {
        this.loggedUser = loggedUser;
        this.isMe = loggedUser.id == this.userId;
        if (this.isMe) {
            this.user = loggedUser;
        } else {
            this.getMyFriendsList();
            this.friends.subscribe(list => {
                this.currentFriendsList = [];
                list.forEach((user, i) => {
                    const userToShow = {firestore_uid: user['friend_id']};
                    user['user'].subscribe(userData => {
                        // console.log('friends item: ', userData);
                        const userToPush = Object.assign(userToShow, userData);
                        let userExist = false;
                        this.currentFriendsList.forEach((item, index) => {
                            if (item.firestore_uid === userToPush.firestore_uid) {
                                this.currentFriendsList[index] = userToPush;
                                userExist = true;
                            }
                        });
                        if (!userExist) {
                            this.currentFriendsList.push(userToPush);
                        }
                        if (i === list.length - 1) {
                            this.canAdd = !this.currentFriendsList.filter(friend => friend.id === +this.userId).length;
                            this.isFriend = !!this.currentFriendsList.filter(friend => friend.id === +this.userId).length;
                        }
                    });
                });
            });

            this._friendsService.getFriendshipRequestsByUserId(this.loggedUser.id).subscribe(requestsList => {
                this.friendsRequests = requestsList.map(request => request.friend);
                if (this.user && this.friendsRequests.indexOf(this.user.email) !== -1) {
                    this.isRequestSent = true;
                } else {
                    this.isRequestSent = false;
                }
            }, error => console.log(error));
        }
    }

    addFriendRequest() {
        const contact: Friends = new Friends;
        contact.name = this.user.name;
        contact.email = this.user.email;
        const contacts: Contacts = new Contacts();
        contacts.friends = [contact];
        contacts.user = this.loggedUser;

        this._friendsService.postInvitationFriend(contacts).subscribe(
            data => {
                console.log(data);
                this.canAdd = false;
                this.isRequestSent = true;
            }, error => {
                console.log(error);
            }
        );
    }

    deleteFriend() {
        this._firestore
            .collection('users')
            .doc(this.loggedUser.firestore_uid)
            .collection('friends', ref => ref.where('uid', '==', this.user.firestore_uid))
            .snapshotChanges()
            .pipe(map(documents => {
                documents.map(document => {
                    this._firestore.collection('users').doc(this.loggedUser.firestore_uid)
                        .collection('friends')
                        .doc(document.payload.doc.id).delete();
                });
            })).pipe(take(1)).subscribe();

        this._firestore
            .collection('users')
            .doc(this.user.firestore_uid)
            .collection('friends', ref => ref.where('uid', '==', this.loggedUser.firestore_uid))
            .snapshotChanges()
            .pipe(map(documents => {
                documents.map(document => {
                    this._firestore.collection('users').doc(this.user.firestore_uid)
                        .collection('friends')
                        .doc(document.payload.doc.id).delete();
                });
            })).pipe(take(1)).subscribe();

        this._firestore
            .collection('post', ref => ref.where('uid', '==', this.loggedUser.firestore_uid))
            .snapshotChanges()
            .pipe(map(documents => {
                documents.map(document => {
                    this._firestore.collection('users').doc(this.user.firestore_uid)
                        .collection('feed', ref => ref.where('post_id', '==',  document.payload.doc.id))
                        .snapshotChanges()
                        .pipe(map(docs => {
                            docs.map(doc => {
                                this._firestore
                                    .collection('users')
                                    .doc(this.user.firestore_uid)
                                    .collection('feed')
                                    .doc(doc.payload.doc.id)
                                    .delete();
                            });
                        })).pipe(take(1)).subscribe();
                });
            })).subscribe();

        this._firestore
            .collection('post', ref => ref.where('uid', '==', this.user.firestore_uid))
            .snapshotChanges()
            .pipe(map(documents => {
                documents.map(document => {
                    this._firestore.collection('users').doc(this.loggedUser.firestore_uid)
                        .collection('feed', ref => ref.where('post_id', '==',  document.payload.doc.id))
                        .snapshotChanges()
                        .pipe(map(docs => {
                            docs.map(doc => {
                                this._firestore
                                    .collection('users')
                                    .doc(this.loggedUser.firestore_uid)
                                    .collection('feed')
                                    .doc(doc.payload.doc.id)
                                    .delete();
                            });
                        })).pipe(take(1)).subscribe();
                });
            })).subscribe();
    }

    public getUser(id: string) {
        this._builderService.getUser(id).subscribe(
            data => {
                this.user = data;
                this.updateLoggedUser(this._storageService.getCurrentUser());
                // console.log(this.user)
                this.country = countries.getName(this.user.country, 'en');

                if (this.isUserMentor()) {
                    this.getMentorContentsList();
                    this.getClientTypes();
                } else {
                    this.mentorVideoList = [];
                    this.mentorArticleList = [];
                }
            }
        );
    }

    public getStories(id) {
        // console.log('getting stories for user', id);
        this._storiesService.getFriendsStoriesById(id).subscribe(
            data => {
                // console.log('profile stories', data)
                this.hasActiveStories = !!data['friend_data'].length;
                // console.log('user stories', this.userStoriesBy24Hours);
            }
        );
    }

    getMyFriendsList(): void {
        this.friends = this._firestore.collection('users')
            .doc(this.loggedUser.firestore_uid)
            .collection('friends')
            .snapshotChanges()
            .pipe(map(friends => {
                return friends.map(friend => {
                    const uid = friend.payload.doc.data().uid;
                    const userFriend = this._firestore.collection('users').doc(uid).valueChanges();
                    return Object.assign({
                        friend_id: uid, user: userFriend
                    });
                });
            }));
    }

    getUserBadge() {
        let badge;

        if (this.user.rol.id === Global.roles.mentor) {
            badge = 'Mentor';
        } else {
            badge = this.user.client.membership.title.split(' ').splice(-1)[0];
        }

        return badge;
    }

    isUserMentor() {
        return (this.user.rol.id === Global.roles.mentor);
    }

    getMentorContentsList() {
        this._contentsService.getListByFilter({client_id: this.user.client.id, type: 4, limit: 3}).subscribe(
            data => {
                this.mentorArticleList = data;
            }
        );
        this._contentsService.getListByFilter({client_id: this.user.client.id, type: 1, limit: 3}).subscribe(
            data => {
                this.mentorVideoList = data;
            }
        );
    }

    safeImageUrl(image) {
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }

    getClientTypes() {
        this._myprogramService.getMyClientTypes().subscribe(data => {
            data.types.forEach(type => this.clientTypes[type.category_id] = type);
        });
    }
}



