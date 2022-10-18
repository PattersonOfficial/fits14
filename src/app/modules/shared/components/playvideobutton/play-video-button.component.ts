import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-playvideobutton",
  templateUrl: "./play-video-button.component.html",
  styleUrls: ["./play-video-button.component.css"],
})
export class PlayVideoButtonComponent implements OnInit {
  @Input() fontSize: string;
  @Output() onPlayVideo: EventEmitter<any> = new EventEmitter();

  public playVideo() {
    this.onPlayVideo.emit();
  }

  constructor() {}

  ngOnInit() {}
}
