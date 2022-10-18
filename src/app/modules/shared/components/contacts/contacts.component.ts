import {Component, OnInit, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { Friends, Message } from '../../../../models/user/friends.model';
import { User } from '../../../../models/user/user.model';

import * as moment from 'moment';

import { StorageService } from '../../../../services/auth/storage.service';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'app-user-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {
  public session: User;
  public friends: Observable<Friends[]>;
  public user: Observable<User[]>;
  public messages: Observable<Message[]>;
  public message;
  public chatId: any;
  public friend: Observable<Friends>;
  public togglePost: boolean;
  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
    public _storageService: StorageService,
    private _contactsService: ContactsService,
  ) {
    this.chatId = 0;
    this.togglePost = false;
  }

  ngOnInit() {
    this.session = this._storageService.getCurrentUser();
    this.user = this._contactsService.getInfoUser(this.session.firestore_uid);
    this.friends = this._contactsService.getMyFriendsList(this.session.firestore_uid);
    this.friends.subscribe((data) => {
      data.forEach((doc) => {
        // if (doc.chat.pendings > 0) {
        //   this.playBeep();
        // }
      });
    });
    this.refreshMessage();
  }

  refreshMessage() {
    this.message = {
      created_at: '',
      content: '',
      uid: this.session.firestore_uid,
      chat_id: this.chatId,
      type: '',
      friend: ''
    };
  }


  toggleSideChat() {
    jQuery('#contact_box').toggleClass('opening');
  }


  openChat(uid): void {
    this.refreshMessage();
    this.message.friend = uid;
    this.validateConversation(this.message.friend, this.session.firestore_uid);
    this.modalRef.show();
  }

  onCloseModal() {
    this.togglePost = false;
  }

  addEmoji(event) {
    this.message.content = this.message.content + event.emoji.native;
  }

  openPickerPost() {
    this.togglePost = !this.togglePost;
  }

  hideChat(): void {
    this.modalRef.hide();
  }

  validateConversation(uid, firestore_uid) {
    this.friend = this._contactsService.getInfoUser(uid);
    this._contactsService.getConversationWithUser(uid, firestore_uid).get().subscribe((conversations) => {
      if (conversations.size > 0) {
        conversations.forEach((doc) => {
          this.getConversation(doc.data().chat_id);
        });
      } else {
        this.createNewConversation(uid, firestore_uid);
        setTimeout(() => {
          console.log(this.chatId);
          this.getConversation(this.chatId);
        }, 500);
      }
    });
  }

  getConversation(chatId) {
    this.chatId = chatId;
    this.message.chat_id = this.chatId;
    this.messages = this._contactsService.getContentConversation(chatId, this.message.friend, this.session.firestore_uid);
  }

  createNewConversation(uid, firestore_uid) {
    this._contactsService.newConversation(uid, firestore_uid).then(chatId => this.chatId = chatId);
  }

  sendMessage() {
    console.log(this.message, this.session)

    this.message.created_at = moment().format('MM/DD/YYYY HH:mm:ss');
    if (this.message.content.length !== 0) {
      this._contactsService.newMessage(this.message, this.message.friend, this.session.firestore_uid);
      // this.refreshMessage();
      this.message.content = '';
    }
  }

  playBeep() {
    const audio = new Audio();
    audio.src = '../../../../../assets/sounds/droop.mp3';
    audio.load();
    audio.play();
  }

}
