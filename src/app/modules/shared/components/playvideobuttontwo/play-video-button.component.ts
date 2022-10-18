import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-playvideobuttontwo',
  templateUrl: './play-video-button-two.component.html',
  styleUrls: ['./play-video-button-two.component.css']
})
export class PlayVideoButtonTwoComponent implements OnInit {
  @Input() fontSize: string = '10px';
  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();

  public playVideo() {
    this.onPlayVideo.emit();
  }

  constructor() { }

  ngOnInit() {
  }

}
