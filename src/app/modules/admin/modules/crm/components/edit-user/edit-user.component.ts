import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {User} from '../../../../../../models/user/user.model';
import {Client} from '../../../../../../models/user/client.model';
import {Memberships} from '../../../../../../models/memberships/memberships.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public isModal = false;
  public usersList: number[];
  public filters: any[];
  public editFields: any[];
  public showField: string;
  public checkedOptions: any;
  public loader = false;

  onHidden: EventEmitter<ModalDirective>;

  constructor(
      private _crmService: CrmService,
  ) {
    this.checkedOptions = {
      membership_id: '',
      status_id: '',
      manager_id: ''
    };
  }

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
  @Output() userEdited = new EventEmitter<string>();

  ngOnInit() {

  }

  public hideModal(): void {
    this.isModal = false;
  }

  public openModal(usersList, editFields): void {
    this.usersList = usersList;
    this.editFields = editFields;
    this.isModal = true;
  }

  public checkOption(field, val) {
    this.checkedOptions[field] === val ? this.checkedOptions[field] = '' : this.checkedOptions[field] = val;
  }

  public saveUsersChanges() {
    this.loader = true;
    const userFields = new User();
    if (this.checkedOptions.manager_id !== '') {
      userFields.manager_id = this.checkedOptions.manager_id;
    }
    if (this.checkedOptions.status_id !== '') {
      userFields.status_id = this.checkedOptions.status_id;
    }
    if (this.checkedOptions.membership_id !== '') {
      const client = new Client();
      const membership = new Memberships();
      membership.id = this.checkedOptions.membership_id;
      client.membership = membership;
      userFields.client = client;
    }
    const updates = this.usersList.map(user => {
      return new Promise((res, rej) => {
        this._crmService.updateUserData(userFields,  user).subscribe(done => {
          res('Done');
        }, err => rej(err));
      });
    });
    Promise.all(updates).then(() => {
      this.userEdited.emit('Users are updated');
      this.hideModal();
    }).catch(fail => {
      console.log(fail);
      this.loader = false;
    });
  }

}
