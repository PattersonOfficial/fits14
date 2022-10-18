import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VodProgram} from '../../../../../../models/vodprogram/vodprogram.model';

@Component({
  selector: 'app-client-mostpopular',
  templateUrl: './most-popular.component.html',
  styleUrls: ['./most-popular.component.css']
})
export class MostPopularComponent implements OnInit {
  @Input() program: VodProgram;
  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public handlePlayClick() {
    this.onPlayVideo.emit(this.program.promo_video_url);
  }

  ngOnInit() {
    // console.log(this.program);
  }

}
