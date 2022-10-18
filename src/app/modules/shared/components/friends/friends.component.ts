import {Component, OnInit, ViewChild, Input, Output, EventEmitter, NgZone, ElementRef} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeStyle, SafeUrl} from '@angular/platform-browser';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Subject, Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import {FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams} from 'ngx-facebook';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {BuilderService} from '../../../admin/modules/users/components/builder/builder.service';
import {StorageService} from '../../../../services/auth/storage.service';
import {FriendsService} from './friends.service';
import {Friends, Contacts} from '../../../../models/user/friends.model';
import {User} from '../../../../models/user/user.model';
declare var gapi: any;

@Component({
    selector: 'app-client-friends',
    templateUrl: './friends-new.component.html',
    styleUrls: ['./friends.component.css']
})

export class FriendsComponent implements OnInit {
    @Output() emitOpenChat = new EventEmitter();
    @Output() emitFriendsCount = new EventEmitter();

    private _fireStoreUId: string;

    get fireStoreUId(): string {
        return this._fireStoreUId;
    }

    @Input()
    set fireStoreUId(val: string) {
        this._fireStoreUId = val;
        if (this._fireStoreUId !== this.user.firestore_uid) {
            this.isMy = false;
        }
        this.getUserFriends();
        this.friendsListSubscribe(this.userFriends);
    }

    public nameCustom: string;
    public emailCustom: string;
    public isWithMail = false;
    public loadingBox = false;
    public loadingModal = false;
    public loadingBoxProfile = false;
    public friends: Observable<Friends[]>;
    public userFriends: Observable<Friends[]>;
    public progress: number;
    public contacts: Contacts;
    public image: SafeStyle;
    public auth2;
    public isFriends = new Subject<any>();
    public selectedContacts: Friends[];
    public isEmpty = false;
    public friend_data: User;
    public myPrograms: any[];
    public searchTimeout: any;
    public searchFriendsResult = [];
    public searchString = '';
    public user: User;
    public currentFriendsList = [];
    public showFriends = [];
    public isMy = true;
    public friendsRequests = [];


    @Input() isValid = true;
    @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
    @ViewChild('modalProfile', {static: false}) modalProfile: ModalDirective;
    @ViewChild('googleLogin', {static: false}) googleLogin: ElementRef;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _storageService: StorageService,
        private _sanitizer: DomSanitizer,
        private _ngZone: NgZone,
        private _facebook: FacebookService,
        public _builderService: BuilderService,
        private _friendsService: FriendsService,
        private _firestore: AngularFirestore
    ) {
        this.emailCustom = '';
        this.nameCustom = '';
        this.myPrograms = [];
        this.friend_data = new User;
        _facebook.init({
            appId: '1629717620468000',
            version: 'v2.9'
        });
        this.user = this._storageService.getCurrentUser();
    }

    ngOnInit() {
        this.contacts = new Contacts;
        this.contacts.friends = [];
        this.selectedContacts = [];
        this.signInGoogle();
    }

    friendsListSubscribe(friends: Observable<Friends[]>) {
        friends.subscribe(list => {
            this.currentFriendsList = [];
            list.forEach((user, i) => {
                if (user) {
                    const userToShow = {firestore_uid: user['friend_id']};
                    user['user'].subscribe(userData => {
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
                            this.emitFriendsCount.emit(this.currentFriendsList.length);
                        }
                    });
                }
            });

            this.showFriends = this.currentFriendsList;
        });
    }

    signInFacebook() {
        const loginOptions: LoginOptions = {
            enable_profile_selector: true,
            return_scopes: true,
            scope: 'public_profile,user_friends,email'
        };

        this._facebook.login(loginOptions)
            .then((res: LoginResponse) => {
                this.fetchContactsFacebook();
            })
            .catch();
    }

    fetchContactsFacebook() {
        this.isWithMail = false;
        this.contacts.friends = [];
        this._facebook.api('/me/friends')
            .then((res: any) => {
                console.log('Got the users friends', res);
                this.modalRef.show();
                this.loadingModal = true;
                if (res.data.length === 0) {
                    this.isEmpty = true;
                    this.loadingModal = false;
                }
            })
            .catch();
    }


    getLoginStatusFacebook() {
        this._facebook.getLoginStatus()
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
    }


    signInGoogle() {
        this.isWithMail = false;
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '518906238537-jki9lr51vq2ttcm61mq5tvl8eo1760lr.apps.googleusercontent.com',
                cookie_policy: 'single_host_origin',
                scope: 'profile email https://www.googleapis.com/auth/contacts.readonly'
            });
            if (this.googleLogin) {

                this.auth2.attachClickHandler(this.googleLogin.nativeElement, {}, this.onSignInGoogle, this.onFailureGoogle);
            }
        });
    }

    onSignInGoogle = (data: any) => {
        this._ngZone.run(() => {
            this.modalRef.show();
            this.loadingModal = true;
            this.fetchContactsGoogle();
        });
    };


    onFailureGoogle = (data: any) => {
        console.log(data);
    }

    async fetchContactsGoogle() {
        this.contacts.friends = [];
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: 'AIzaSyC4UcXnDcOSHBoyzdMQEub7liJtVXJzGzw',
                discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
                clientId: '518906238537-jki9lr51vq2ttcm61mq5tvl8eo1760lr.apps.googleusercontent.com',
                scope: 'profile email https://www.googleapis.com/auth/contacts.readonly'
            }).then(() => {
                return gapi.client.people.people.connections.list({
                    resourceName: 'people/me',
                    personFields: 'emailAddresses,names,coverPhotos'
                });
            }).then(
                (res) => {
                    console.log(res);
                    this._ngZone.run(() => {
                        this.parseContactsGoogle(res.result);
                        this.loadingModal = false;
                    });
                },
                error => console.log('ERROR ' + JSON.stringify(error))
            );
        });


    }

    parseContactsGoogle(res) {
        if (String(res.connections) !== 'undefined') {
            res.connections.map(item => {
                let mail;
                if (String(item.emailAddresses) !== 'undefined') {
                    mail = item.emailAddresses[0].value;

                    if (mail != null) {
                        const contact: Friends = new Friends;
                        contact.name = item.names[0].displayName;
                        contact.email = mail;
                        this.contacts.friends.push(contact);
                    }
                    mail = null;
                }
            });

        } else {
            this.isEmpty = true;
        }
    }


    setFriend(e, friend: Friends): void {
        if (e.target.checked) {
            this.selectedContacts.push(friend);
        } else {
            const index = this.selectedContacts.indexOf(friend);
            if (index > -1) {
                this.selectedContacts.splice(index, 1);
            }
        }
    }

    searchUsers(e): void {
        const searchStr = e.target.value.trim().toLowerCase();
        this.searchString = searchStr;
        this.searchFriendsResult = [];
        this.showFriends = [];
        this.currentFriendsList.forEach((friend, i) => {
            if (!this.showFriends.filter(user => user.id === friend.id).length && friend.name.toLowerCase().indexOf(searchStr) !== -1) {
                this.showFriends.push(this.currentFriendsList[i]);
            }
        });
        if (searchStr.length > 2) {
            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                this._friendsService.searchUsers(searchStr).subscribe(users => {
                    users.forEach(user => {
                        if (user.id !== this.user.id && this.currentFriendsList.filter(friend => friend.firestore_uid === user.firestore_uid).length === 0) {
                            user.canAdd = this.friendsRequests.indexOf(user.email) === -1;
                            this.searchFriendsResult.push(user);
                        }
                    });
                }, err => console.log(err));
            }, 500);
        }
    }

    sendInvitation(): void {
        this.loadingModal = true;
        this.contacts.user = this._storageService.getCurrentUser();
        this.contacts.friends = this.selectedContacts;

        this._friendsService.postInvitationFriend(this.contacts).subscribe(
            data => {
                this.modalRef.hide();
                this.contacts.friends = [];
                this.loadingModal = false;
            }
        );
    }

    getMyFriendshipRequests(): void {
        this._friendsService.getFriendshipRequestsByUserId(this.user.id).subscribe(requests => {
            this.friendsRequests = requests.map(request => request.friend);
        }, error => console.log(error));
    }

    getUserFriends(): void {
        this.userFriends = this._firestore.collection('users')
            .doc(this._fireStoreUId)
            .collection('friends')
            .snapshotChanges()
            .pipe(map(friends => {
                return friends.map(friend => {
                    const uid = friend.payload.doc.data().uid;
                    if (uid !== undefined) {
                        const userFriend = this._firestore.collection('users').doc(uid).valueChanges();
                        return Object.assign({
                            friend_id: uid, user: userFriend
                        });
                    }
                });
            }));
    }

    public getUser(uid) {
        this.loadingBoxProfile = true;
        this.modalProfile.show();
        this._builderService.getUserBySocket(uid).subscribe(
            data => {
                this.friend_data = data;
                this.loadingBoxProfile = false;
                this.getPrograms(data.client.id);
            }
        );
    }

    public openChat(id) {
        console.log(id);
        this.emitOpenChat.emit(id);
        jQuery('#contact_box').toggleClass('opening');
    }

    public getPrograms(uid) {
        this._builderService.getPrograms(uid).subscribe(
            data => {
                this.myPrograms = ['data'];
            }
        );
    }

    inviteWithEmail() {
        this.isWithMail = true;
        this.modalRef.show();
    }

    sendInvitationCustom() {
        const contact: Friends = new Friends;
        contact.name = this.nameCustom;
        contact.email = this.emailCustom;
        this.selectedContacts.push(contact);
        this.sendInvitation();
        this.isWithMail = false;
    }

    addFriendRequest(friend: Friends, i: number) {
        const contact: Friends = new Friends;
        contact.name = friend.name;
        contact.email = friend.email;
        this.selectedContacts.push(contact);
        this.contacts.user = this._storageService.getCurrentUser();
        this.contacts.friends = this.selectedContacts;

        console.log(this.contacts);

        this._friendsService.postInvitationFriend(this.contacts).subscribe(
            data => {
                this.modalRef.hide();
                this.contacts.friends = [];
                this.loadingModal = false;
                this.friendsRequests.push(friend.email);
                this.searchFriendsResult[i].canAdd = false;
            }, error => {
                console.log(error);
                this.modalRef.hide();
                this.contacts.friends = [];
                this.loadingModal = false;
            }
        );
    }
}
