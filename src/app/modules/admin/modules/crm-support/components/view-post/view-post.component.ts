import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {FeedService} from '../../../../../shared/components/feed/feed.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css', '../../../../../shared/components/feed/feed.component.css']
})
export class ViewPostComponent implements OnInit {

  public isModal = false;
  public loader = false;
  public data: any;
  public postId: string;
  public deleted = false;

  onHidden: EventEmitter<ModalDirective>;

  constructor(
      private _crmService: CrmService,
      private _feedService: FeedService,
  ) {}

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  ngOnInit() {

  }

  public getPost(postId) {
    this.loader = true;
    this._feedService.getPostById(postId).subscribe(data => {
      this.data = {...data};
      if (this.data.user) {
        this.data.user.subscribe(user => {
          this.data.user = user;
        });
      }
      if (!this.data.uid) {
        this.data = null;
      }
      this.loader = false;
    });
  }

  public handleDeletePost() {
    this.loader = true;
    this._feedService.deletePostById(this.postId).then(() => {
      this.loader = false;
      this.deleted = true;
    }, err => {
      console.log(err);
    });
  }

  public hideModal(): void {
    this.isModal = false;
  }

  public openModal(postId): void {
    this.postId = postId;
    this.getPost(postId);
    this.isModal = true;
  }
}
