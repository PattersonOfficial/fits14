import { Component, ViewChild, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  providers: []
})

export class AlertComponent implements OnInit {

  public alerts: Alerts[] = [];

  constructor(

  ) {

  }

  ngOnInit() {
    this.alerts = [];
  }

  public hide(event: any) {
    this.alerts.splice(event, 1);
  }

  public show(data: Alerts) {
    this.alerts.push(data);
    setTimeout(() => {
      this.alerts.splice(this.alerts.indexOf(data), 1);
    }, 10000);
  }

}


export class Alerts {
  public date: string = '';
  public title: string = '';
  public image: string = '';
  public url: string = '';
}
