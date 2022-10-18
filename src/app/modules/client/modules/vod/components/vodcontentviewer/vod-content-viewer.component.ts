import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contents } from '../../../../../../models/contents/contents.model';

@Component({
  selector: 'app-vod-content-viewer',
  templateUrl: './vod-content-viewer.component.html',
  styleUrls: ['./vod-content-viewer.component.css'],
})
export class VodContentViewerComponent implements OnInit {
  @Input() content: Contents;
  @Input() contentType: number;
  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  public handlePlayVideo() {
    this.onPlayVideo.emit(this.content);
  }
}
