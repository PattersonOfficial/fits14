
import {take, map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

import {BuilderService} from './builder.service';

import {Global} from '../../../../../../app.global';
import {User} from '../../../../../../models/user/user.model';
import {Memberships} from '../../../../../../models/memberships/memberships.model';
import {RegisterService} from '../../../../../../components/register/register.service';
import * as moment from 'moment';
import {Role} from '../../../../../../models/user/roles.model';

@Component({
    selector: 'app-users',
    templateUrl: './builder.component.html',
    styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit {

    type: string;
    id: string;
    loadingBox = false;
    users: User[];
    isValid: boolean = false;
    childs: any[];
    trashed: any[];
    registerFields: User;
    step: number;
    selectCountry: any;
    countries: any;
    codes_dialling: any;
    mailExist: boolean;
    showTooltipBirthDay: boolean;
    phoneExist: boolean;
    submitted = false;
    memberships: Memberships;
    error: { code: number, message: string } = null;
    roles: Role[];

    constructor(
        public _builderService: BuilderService,
        private _firestore: AngularFirestore,
        private _route: ActivatedRoute,
        public _router: Router,
        public _registerService: RegisterService,
    ) {
        this.registerFields = new User();
        this.childs = [];
        this.trashed = [];
        this.step = 1;
        this.mailExist = true;
        this.phoneExist = true;
        this.id = '';
    }

    ngOnInit() {
        this.type = '';
        this.step = 1;
        this._route.params.subscribe(params => {
            this.type = params['type'];
            this.id = params['id'];
        });

        console.log(this.id);

        this.listOfCountries();
        this.getRoles();

        if (this.id != undefined) {
            this.getUser(this.id);
        }

        this.listMemberships();
        this.listUsers(Global.roles.client);
    }

    ngAfterViewInit() {
        if (this.id == undefined) {
            this.registerFields = new User();
        }
    }

    setCountryAndCode(country) {
        this.codes_dialling = country.callingCodes;
        this.registerFields.code_dialling = country.callingCodes[0];
        this.registerFields.country = country.alpha2Code;
        this.selectCountry = country;
    }

    public changeChildsList(child) {
        if (this.childs.indexOf(child) == -1 && child.name != null) {
            this.childs.push(child);
        }
    }

    public setMembership(membership: Memberships) {
        this.registerFields.client.membership = membership;
    }

    public trashChild(child) {
        if (this.childs.indexOf(child) != -1) {
            this.childs.splice(this.childs.indexOf(child), 1);

            this.trashed.push(child);
        }
    }

    public listOfCountries() {
        this._registerService.getCountries().subscribe(
            data => {
                this.countries = data;
            }
        );
    }

    public listUsers(role): void {
        this._builderService.getUsers(role).subscribe(
            data => {
                this.users = data;
            }
        );
    }

    public listMemberships() {
        this._registerService.getMemberships().subscribe(
            response => {
                this.memberships = response;
            }
        );
    }

    public getRoles() {
        this._registerService.getRoles().subscribe(
            (data: Role[]) => {
                this.roles = data;
            }
        );
    }

    private correctRegister(data) {
        if (this.type === 'client') {
            this._router.navigate(['/board/a/users/view/clients']);
        } else if (this.type === 'mentor') {
            this._router.navigate(['/board/a/users/view/mentors']);
        } else if (this.type === 'manager') {
            this._router.navigate(['/board/a/users/view/managers']);
        } else if (this.type === 'administrator') {
            this._router.navigate(['/board/a/users/view/administrators']);
        }
    }

    private compareByOptionId(idFist, idSecond) {
        return idFist && idSecond && idFist.id == idSecond.id;
    }

    setStep(step) {
        console.log(this.registerFields);
        this.step = step;
    }

    private setRole() {
        if (this.type === 'client') {
            this.registerFields.rol.id = Global.roles.client;
            this.registerFields.rol.name = 'Client';
        } else if (this.type === 'mentor') {
            this.registerFields.rol.id = Global.roles.mentor;
            this.registerFields.rol.name = 'Mentor';
        } else if (this.type === 'manager') {
            this.registerFields.rol.id = Global.roles.manager;
            this.registerFields.rol.name = 'Manager';
        } else if (this.type === 'administrator') {
            this.registerFields.rol.id = Global.roles.administrator;
            this.registerFields.rol.name = 'Administrator';
        }
    }

    submitRegister() {
        this.setRole();
        this.registerFields.childs = this.childs;
        if (this.registerFields.id != null) {
            this._builderService.updateUser(this.registerFields).subscribe(
                data => {
                    this.parseChildsForFirestore(this.registerFields.firestore_uid);
                    this.correctRegister(data);
                }
            );
        } else {
            this._builderService.saveUser(this.registerFields).subscribe(
                data => {
                    this.correctRegister(data);
                }
            );
        }
    }

    parseChildsForFirestore(uid) {
        this.trashed.forEach(child => {
            let ex_trash = this._firestore.collection('users').doc(uid).collection('friends', ref => ref.where('uid', '==', child.firestore_uid)).snapshotChanges().pipe(map(documents => {
                documents.map(document => {
                    this._firestore.collection('users').doc(uid).collection('friends').doc(document.payload.doc.id).delete();
                });
            })).pipe(take(1)).subscribe();

            let fr_trash = this._firestore.collection('users').doc(child.firestore_uid).collection('friends', ref => ref.where('uid', '==', uid)).snapshotChanges().pipe(map(documents => {
                documents.map(document => {
                    this._firestore.collection('users').doc(child.firestore_uid).collection('friends').doc(document.payload.doc.id).delete();
                });
            })).pipe(take(1)).subscribe();
        });

        this.childs.forEach(child => {
            console.log(child);
            let manager = this._firestore.collection('users').doc(uid).collection('friends');

            let exist = this._firestore.collection('users').doc(uid).collection('friends', ref => ref.where('uid', '==', child.firestore_uid));
            exist.get().subscribe((documents) => {
                if (documents.size == 0) {
                    manager.add({
                        uid: child.firestore_uid,
                        updated_at: moment().format('MM/DD/YYYY HH:mm:ss'),
                        pendings: 0
                    });

                    let friend = this._firestore.collection('users').doc(child.firestore_uid).collection('friends');
                    friend.add({
                        uid: uid,
                        updated_at: moment().format('MM/DD/YYYY HH:mm:ss'),
                        pendings: 0
                    });
                }
            });
        });
    }

    public verifyEmail(email: string) {
        if (!this.registerFields.id) {
            this._registerService.checkEmail(email).subscribe(
                data => {
                    this.mailExist = data['exist'];
                }
            );
        }
    }

    public getUser(id: string) {
        this.loadingBox = true;
        this._builderService.getUser(id).subscribe(
            data => {
                console.log(data);

                if (this.countries) {
                    this.selectCountry = this.countries[this.countries.map((e) => e.alpha2Code).indexOf(data.country)];
                }

                this.registerFields = data;
                this.parseChilds(data.childs);
                this.codes_dialling = [
                    data.code_dialling
                ];
                this.loadingBox = false;
            }
        );
    }

    parseChilds(childs) {
        childs.forEach(child => {
            const item = new User;
            item.name = child.client.user.name;
            item.firestore_uid = child.client.user.firestore_uid;
            item.profile_image.public_url = child.client.user.profile_image.public_url;
            item.client.id = child.client.id;

            this.childs.push(item);
        });
    }

    verifyPhone(phone: string) {
        if (!this.registerFields.id) {
            this._registerService.checkPhone(phone).subscribe(
                data => {
                    this.phoneExist = data.exist;
                }
            );
        }
    }
}
