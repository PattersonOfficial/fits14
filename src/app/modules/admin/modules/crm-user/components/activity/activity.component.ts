import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../../../models/user/user.model';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css', '../user-info/user-info.component.css']
})
export class ActivityComponent implements OnInit {

  public showLogs = true;
  public showVideo = true;
  public showService = true;

  private _user: User;

  get user(): User {
    return this._user;
  }

  @Input()
  set user(val: User) {
    this._user = {...val};
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
