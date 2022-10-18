import {Component, Input} from '@angular/core';
import {Contents} from '../../../../../../models/contents/contents.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-videos-lesson-card',
  templateUrl: './my-videos-lesson-card.component.html',
  styleUrls: ['./my-videos-lesson-card.component.css']
})
export class MyVideosLessonCardComponent {

  @Input() lesson: Contents;
  @Input() programId: number;
  @Input() isSide: boolean;

  public playIcon = '<i class="fas fa-play"></i>';

  constructor(
      private _router: Router,
  ) { }

  public goToLesson() {
    this._router.navigate(['board/u/vod', 'my-videos', this.programId, this.lesson.id, 1]);
  }
}
