import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import * as moment from 'moment';
import {MentorsService} from '../../modules/admin/modules/users/components/mentors/mentors.service';
import {Global} from '../../app.global';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    constructor(
        public _mentorsService: MentorsService,
        private firestore: AngularFirestore
    ) {
    }

    addMentorsAsFriendsOfUser(userFirestoreId: string) {
        this._mentorsService.getUsers(String(Global.roles.mentor)).subscribe(
            (mentors) => {
                mentors.forEach((mentor) => {
                    if (mentor.firestore_uid === userFirestoreId) {
                        return;
                    }

                    this.firestore.collection('users').doc(mentor.firestore_uid).set({
                        name: mentor.name + ' ' + (mentor.last_name || ''),
                        email: mentor.email,
                        profile_image: mentor.profile_image.public_url,
                        id: mentor.id,
                        status: 1
                    }, {merge: true});

                    const mentorFriendCollection = this.firestore
                        .collection('users')
                        .doc(mentor.firestore_uid)
                        .collection('friends');

                    const existForMentor = this.firestore
                        .collection('users')
                        .doc(mentor.firestore_uid)
                        .collection('friends', ref => ref.where('uid', '==', userFirestoreId));

                    const existForUser = this.firestore
                        .collection('users')
                        .doc(userFirestoreId)
                        .collection('friends', ref => ref.where('uid', '==', mentor.firestore_uid));

                    existForMentor.get().subscribe((documents) => {
                        if (documents.size === 0) {
                            mentorFriendCollection.add({
                                uid: userFirestoreId,
                                updated_at: moment().format('MM/DD/YYYY HH:mm:ss'),
                                pendings: 0
                            });
                        }
                    });

                    existForUser.get().subscribe((documents) => {
                        if (documents.size === 0) {
                            const friend = this.firestore
                                .collection('users')
                                .doc(userFirestoreId)
                                .collection('friends');

                            friend.add({
                                uid: mentor.firestore_uid,
                                updated_at: moment().format('MM/DD/YYYY HH:mm:ss'),
                                pendings: 0
                            });
                        }
                    });
                });
            }
        );
    }
}
