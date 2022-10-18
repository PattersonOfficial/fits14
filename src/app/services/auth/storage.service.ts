import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Session } from '../../models/auth/session.model';
import { User } from '../../models/user/user.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class StorageService {

    public isLogged = new Subject<any>();
    public isValidAuth = new Subject<any>();
    public isSessionChanged = new Subject<any>();
    public isUserChanged = new Subject<any>();
    private localStorageService;
    private localSessionService;
    private currentSession: Session;
    public url: string;

    constructor(
        private _firestore: AngularFirestore,
        private router: Router,
        public _http: HttpClient
    ) {
        this.localStorageService = localStorage;
        this.localSessionService = sessionStorage;
        this.currentSession = this.loadSessionData();
        this.url = environment.api;
    }

    setCurrentSession(session: any): void {
        this.currentSession = session;
        // console.log(session.user.client);
        // this.localStorageService.setItem('loggedUser', JSON.stringify(session));
        localStorage.setItem('loggedUser', JSON.stringify(session));
        this.isLogged.next(true);
        this.isSessionChanged.next(this.getCurrentSession());
        this.isUserChanged.next(this.getCurrentUser());
    }

    setUserSession(user: User): void {
        // const session: Session = this.getCurrentSession();
        const session: Session = JSON.parse(localStorage.getItem('loggedUser'));
        session.user = user;
        // console.log(session.user.client);
        this._firestore.collection('users').doc(session.user.firestore_uid).set({
            name: session.user.name + ' ' + (session.user.last_name || ''),
            email: session.user.email,
            profile_image: session.user.profile_image.public_url,
            id: session.user.id,
            status: 1,
            client: user.client
        }, {merge: true});
        // this.localStorageService.setItem('loggedUser', JSON.stringify(session));
        this.refreshUserData();
        this.isUserChanged.next(this.getCurrentUser());
    }

    getUserData(): Observable<any> {
        const path = '/auth/refresh-my-data';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, {headers: headers});
    }


    setSecureData(): Observable<any> {
        const path = '/auth/secure-resources';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, {headers: headers});
    }

    refreshUserData() {
        this.getUserData().subscribe(
            data => {
                this.setCurrentSession(data);
            }
        );
    }

    refreshSecureData() {
        this.setSecureData().subscribe(
            data => {

            }
        );
    }

    setExtraData(key: string, data: any): void {
        this.localStorageService.setItem(key, data);
    }

    setExtraDataSession(key: string, data: any): void {
        this.localSessionService.setItem(key, data);
    }

    loadExtraData(key: string) {
        const extraStr = this.localStorageService.getItem(key);
        return (extraStr) ? extraStr : null;
    }

    loadExtraDataSession(key: string) {
        const extraStr = this.localSessionService.getItem(key);
        return (extraStr) ? extraStr : null;
    }

    loadSessionData(): Session {
        const sessionStr = this.localStorageService.getItem('loggedUser');
        return (sessionStr) ? <Session>JSON.parse(sessionStr) : null;
    }

    getCurrentSession(): Session {
        return this.loadSessionData();
    }

    removeCurrentSession(): void {
        this.localStorageService.removeItem('loggedUser');
        this.currentSession = null;
        localStorage.clear();
        sessionStorage.clear();
        this.isLogged.next(false);
    }

    getCurrentUser(): User {
        const session: Session = this.getCurrentSession();
        return (session && session.user) ? session.user : null;
    }

    isAuthenticated(): boolean {
        return (this.getCurrentToken() != null) ? true : false;
    }

    getCurrentToken(): string {
        const session = this.getCurrentSession();
        return (session && session.token) ? session.token : null;
    }

    reValidateSession() {
        this.localStorageService.removeItem('loggedUser');
        this.currentSession = null;
        this.isValidAuth.next(true);
    }

    logout(): void {
        const user = this.getCurrentUser();
        this._firestore.collection('users').doc(user.firestore_uid).set({
            status: 0
        }, {merge: true});

        this.localStorageService.clear();
        this.localSessionService.clear();
        this.currentSession = null;
        this.isLogged.next(false);
        // this.removeCurrentSession();
        this.router.navigate(['/login']);
    }
}
