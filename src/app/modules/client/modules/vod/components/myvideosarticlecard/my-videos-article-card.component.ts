import {Component, Input} from '@angular/core';
import {Contents} from '../../../../../../models/contents/contents.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-videos-article-card',
  templateUrl: './my-videos-article-card.component.html',
  styleUrls: ['./my-videos-article-card.component.css']
})
export class MyVideosArticleCardComponent {

  @Input() article: Contents;
  @Input() programId: number;

  public readMore = '<strong class="read-more">... Read More</strong>';

  constructor(
      private _router: Router,
  ) { }

  goToArticle() {
    this._router.navigate(['/board/u/vod/my-videos', this.programId, this.article.id, 4]);
  }
}
