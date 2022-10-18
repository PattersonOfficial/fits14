
import {take, map, filter} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from "../../../../models/user/friends.model";

import * as moment from 'moment';

import { environment } from '../../../../../environments/environment';
import {snapshotChanges} from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  public url: string;
  constructor(
    public _http: HttpClient,
    private _firestore: AngularFirestore,
  ) {
    this.url = environment.api;
  }

  /**
   * Obtiene información de usuario
   *
   * @return Observable
   */
  getInfoUser(firestore_uid: string): Observable<any> {
    return this._firestore.collection('users').doc(firestore_uid).valueChanges();
  }


  /**
   * Obtiene lista de amigos
   *
   * @return Observable
   */
  getMyFriendsList(firestore_uid: string): Observable<any> {
    return this._firestore.collection('users').doc(firestore_uid).collection('friends', ref => ref.orderBy('updated_at', 'desc')).snapshotChanges().pipe(map(friends => {
      return friends.map(friend => {
        const uid = friend.payload.doc.data().uid;
        const userFriend = this.getInfoUser(uid);
        return Object.assign({
          friend_id: uid, user: userFriend, chat: friend.payload.doc.data()
        });
      });
    }));
  }

  /**
   * Obtiene contenido conversacion de usuario
   *
   * @return Observable
   */
  getContentConversation(chat_id: string, friend_uid, firestore_uid): Observable<any> {
    this._firestore.collection('users').doc(firestore_uid).collection('friends', ref => ref.where('uid', '==', friend_uid)).snapshotChanges().pipe(map(documents => {
      documents.map(document => {
        let pendings = 0;
        this._firestore.collection('users').doc(firestore_uid).collection('friends').doc(document.payload.doc.id).set({
          pendings: pendings,
          updated_at: moment().format('MM/DD/YYYY HH:mm:ss')
        }, { merge: true });
      });
    })).pipe(take(1)).subscribe();

    return this._firestore.collection('conversations', ref => ref.where('chat_id', '==', chat_id).orderBy('created_at', 'asc').limit(20)).snapshotChanges().pipe(map(messages => {
      return messages.map(message => {
        const msg = message.payload.doc.data() as Message;
        const chatId = message.payload.doc.id;
        const userMessage = this.getInfoUser(msg.uid);
        return Object.assign({
          chatId: chatId, data: msg, user: userMessage
        });
      });
    }));
  }

  /**
   * Obtiene conversacion de usuario
   *
   * @return Observable
   */
  getConversationWithUser(uid, firestore_uid) {
    return this._firestore.collection('users').doc(uid).collection('conversations', ref => ref.where('uid', '==', firestore_uid).limit(1));
  }

  /**
   * Crea conversacion en usuarios
   *
   * @return void
   */
  newConversation(uid, firestore_uid) {
    return new Promise((res, rej) => {
      const conversation = this.getNumberRand();
      const created = moment().format('MM/DD/YYYY HH:mm:ss');
      this._firestore.collection('users').doc(uid).collection('conversations').add({
        uid: firestore_uid,
        chat_id: conversation,
        created_at: created
      }).then(() => res(conversation));

      this._firestore.collection('users').doc(firestore_uid).collection('conversations').add({
        uid: uid,
        chat_id: conversation,
        created_at: created
      });
    });
  }


  newMessage(message: object, friend_uid, firestore_uid) {
    this._firestore.collection('conversations').add(message);

    this._firestore.collection('users').doc(friend_uid).collection('friends', ref => ref.where('uid', '==', firestore_uid)).snapshotChanges().pipe(map(documents => {
      documents.map(document => {
        this._firestore.collection('users').doc(friend_uid).collection('friends').doc(document.payload.doc.id).get().subscribe(data => {
          const pendings = data.data().pendings + 1;
          this._firestore.collection('users').doc(friend_uid).collection('friends').doc(document.payload.doc.id).set({
            pendings: pendings,
            updated_at: moment().format('MM/DD/YYYY HH:mm:ss'),
            uid: firestore_uid,
          }, { merge: true });
        });
      });
    })).pipe(take(1)).subscribe();
  }

  /**
   * Genera cadena numerica aleatoria
   *
   * @return number
   */
  public getNumberRand() {
    return Math.round((new Date()).getTime() * Math.random() * Math.random() + Math.random());
  }

}
