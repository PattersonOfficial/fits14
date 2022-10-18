import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../../../models/user/user.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css', '../user-info/user-info.component.css']
})
export class NotesComponent implements OnInit {

  public showInternal = true;
  public showRetention  = true;
  public showService = true;

  private _user: User;

  get user(): User {
    return this._user;
  }

  @Input()
  set user(val: User) {
    this._user = {...val};
    // this.editPersonal = false;
    // this.editAddress = false;
  }

  @Output() saveUser = new EventEmitter<User>();

  constructor(

  ) {}

  ngOnInit() {

  }

  saveChanges() {
    this.saveUser.emit(this.user);
  }

}
