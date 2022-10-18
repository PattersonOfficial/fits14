
import {take, scan, flatMap, map, reduce, filter} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable ,  BehaviorSubject ,  combineLatest } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/firestore';



import { environment } from '../../../../../environments/environment';
import { StorageService } from "../../../../services/auth/storage.service";

import { Feed, Post } from "../../../../models/feed/feed.model";
import {User} from '../../../../models/user/user.model';


@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private _data = new BehaviorSubject([]);
  public url: string;
  public data: Observable<any>;
  private lastCursor: QueryDocumentSnapshot<any>;
  public itLiked: any[];
  public subscription: any;
  public subscriptionLast: any;
  constructor(
    private _firestore: AngularFirestore,
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
    this.itLiked = [];
  }


  /**
   * Publicaciones recientes
   *
   * @param  uid
   * @return
   */
  public getInitFeed(uid) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionLast) {
      this.subscriptionLast.unsubscribe();
    }
    const initPosts = this._firestore.collection('users').doc(uid).collection('feed', ref => ref.orderBy('created_at', 'desc').limit(10));
    this.subscription = this.mapAndUpdateFeed(initPosts, uid).subscribe();
    this.observeChangesFeed();
  }

  /**
   * Observa cambios para enviar a vista desde Sujeto
   *
   * @return
   */
  public observeChangesFeed() {
    this.data = this._data.asObservable().pipe(map((documents, i) => {
      return documents;
    }), flatMap(feeds => combineLatest(feeds))).pipe(scan((acc, val) => {
      val = val.filter(item => item !== undefined);
      acc = acc.filter(item => item !== undefined);
      acc.forEach((item, index) => {
        let exist;
        exist = val.map((e) => {
          if (e) {
            return e.id;
          }
        }).indexOf(item.id);
        if (exist == -1) {
          acc.splice(index, 1);
        }
      });
      acc.filter(item => item !== undefined).forEach((item, i) => {
        let exist;
        if (item === undefined) {
          exist = 0;
        } else {
          exist = val.map((e) => {
            if (e) {
              return e.id;
            }
          }).indexOf(item.id);
        }
        if (exist != -1) {
          val.splice(exist, 1);
        }
      });
      return val.length > 0 ? val.concat(acc).filter(item => item !== undefined) : acc.concat(val).filter(item => item !== undefined);
    }));
  }

  /**
   * Obtiene post anteriores de Firestore
   *
   * @param  uid
   * @return
   */
  public lastPostsFeed(uid) {
    const cursor = this.lastCursor;
    const lastPosts = this._firestore.collection('users').doc(uid).collection('feed', ref => ref.orderBy('created_at', 'desc').limit(7).startAfter(cursor));
    this.subscriptionLast = this.mapAndUpdateFeed(lastPosts, uid).pipe(take(1)).subscribe();
  }

  /**
   * Mapea resultados de la colección Firestore
   *
   * @param  collections
   * @return
   */
  private mapAndUpdateFeed(collections: AngularFirestoreCollection<any>, uid: string) {
    return collections.snapshotChanges()
      .pipe(map(documents => {
        const deleted = [];
        const values = documents.map(document => {
          const doc = document.payload.doc;
          return this.getPosts().doc(document.payload.doc.data().post_id).snapshotChanges().pipe(map((postDocument, index) => {

            const post = postDocument.payload.data() as Feed;

            if (post) {
              const user = this.getUsers().doc(post.uid).valueChanges();

              const comments = this.getPosts().doc(document.payload.doc.data().post_id).collection('comments', ref => ref.orderBy('created_at', 'desc')).snapshotChanges().pipe(map(comments => {
                return comments.map(comment => {
                  const item = comment.payload.doc.data();
                  const userComment = this.getUsers().doc(item.uid).valueChanges();
                  return Object.assign({
                    ...item, user: userComment
                  });
                });
              }));

              const likes = this.getPosts()
                  .doc(document.payload.doc.data().post_id)
                  .collection('likes', ref => ref.orderBy('created_at', 'asc'))
                  .snapshotChanges()
                  .pipe(map(likesList => {
                    return likesList.map(like => {
                      const item = like.payload.doc.data();
                      const userLike = this.getUsers().doc(item.uid).valueChanges();

                      // Si el usuario actual ha echo like sobre el post se almacena en arreglo global la id del post
                      if (item.uid == this._storageService.getCurrentUser().firestore_uid) {
                        this.itLiked.push(document.payload.doc.data().post_id);
                      }

                      return Object.assign({
                        ...item, user: userLike
                      });
                    });
                  }));

              this.lastCursor = doc;

              return Object.assign({
                ...post, doc: doc, user: user, comments: comments, likes: likes, id: document.payload.doc.data().post_id
              });
            } else {
              deleted.push(index);
            }
          }));
        });

        deleted.forEach(index => values.splice(index, 1));
        this._data.next(values);
      })
    );
  }

  public getMyFriends(user) {
    return this._firestore.collection('users').doc(user).collection('friends');
  }

 
  public getUserData(user) {
    return this._firestore.collection('users').doc(user);
  }

  public addPost(post) {
    return this._firestore.collection('post').add(post);
  }

  public getPostsUser(user) {
    return this._firestore.collection('users').doc(user).collection('feed', ref => ref.orderBy('created_at', 'desc').limit(7));
  }

  public getPosts() {
    return this._firestore.collection('post');
  }

  public getPostById(postId) {
    return this.getPosts().doc(postId).snapshotChanges().pipe(map((postDocument => {
      const post = postDocument.payload.data() as Feed;
      let user;
      if (post) {
        user = this.getUsers().doc(post.uid).valueChanges();
      }
      return Object.assign({ ...post, user: user});
    })));
  }

  deletePostById(postId) {
    return new Promise(resolve => {
      this.getPosts().doc(postId).delete().then(() => {
        const del = this.getUsers().snapshotChanges()
            .pipe(map(documents => {
              const users = documents.map(document => {
                const id = document.payload.doc.id;

                const feed = this.getUsers().doc(id).snapshotChanges().pipe(map((userDocument, index) => {
                  const feedCollection = this.getUsers().doc(id).collection('feed', ref => ref.where('post_id', '==', postId)).snapshotChanges().pipe(map(feeds => {
                    return feeds.map(feedItem => {
                      const feedId = feedItem.payload.doc.id;
                      return this.getUsers().doc(id).collection('feed').doc(feedId).delete().then(() => console.log('deleted ', feedId));
                    });
                  }));
                  feedCollection.subscribe();
                }));
                feed.subscribe();
              });
            }));
        del.subscribe();
        setTimeout(() => resolve(), 2000);
      });
    });
  }

  public getUsers() {
    return this._firestore.collection('users');
  }

  /**
   * Carga requerimientos de amistad
   *
   * @return
   */
  public getFriendsRequire(): Observable<any> {
    const path = '/account/friends/requirements';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }


  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadFiles(files: FormData): Observable<any> {
    const req = new HttpRequest<FormData>('POST', this.url + '/account/feed/file-upload', files, {
      reportProgress: true
    });

    return this._http.request(req);
  }



  acceptFriend(mesagge: Feed): Observable<any> {
    const path = '/account/friends/accept';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path + `/${mesagge.id}`, { headers: headers });
  }

  declineFriend(requirement: Feed): Observable<any> {
    const path = '/account/friends/decline';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path + `/${requirement.id}`, { headers: headers });
  }

  listFriendsRequirements(): Observable<any> {
    const path = '/account/friends/requirements';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  listCookiesResources(): Observable<any> {
    const path = '/auth/secure-resources';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }
}
