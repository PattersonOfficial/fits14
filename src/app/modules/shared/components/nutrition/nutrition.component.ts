import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { StorageService } from "../../../../services/auth/storage.service";
import { NutritionService } from "./nutrition.service";

@Component({
  selector: 'app-client-nutrition',
  templateUrl: './nutrition-new.component.html',
  // templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})

export class NutritionComponent implements OnInit {

  public total: number;
  public finished: number;
  public calories = 0;

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;

  constructor(
    public _storageService: StorageService,
    public _nutritionService: NutritionService
  ) {
    this.total = 0;
    this.finished = 0;

  }

  ngOnInit() {
    this.getProgress();

    // this.getCalories(270);
  }

  getProgress() {
    this._nutritionService.getProgress().subscribe(
      (data) => {
        this.total = data.total;
        this.finished = data.finished;
      }
    );
  }

  changeSliderCalories(event) {
    this.calories = event.from;
  }

  // getCalories(percent) {
  //   const circle = document.querySelector('.progress-ring__circle');
  //   const radius = circle['r'].baseVal.value;
  //   const circumference = 2 * Math.PI * radius;
  //   const span = document.querySelector('.thumb');

  //   circle['style'].strokeDasharray = `${circumference} ${circumference}`;
  //   circle['style'].strokeDashoffset = circumference;

  //   const offset = circumference - percent / 360 * circumference;
  //   circle['style'].strokeDashoffset = offset;
  //   span['style'].transform = `rotate(${percent - 90}deg)`;

  //   this.calories = Math.floor((2200 * percent) / 360);
  // }

  // setCalories() {
  //     const randomNum = Math.round(Math.random() * 360);
  //     setTimeout( () => {
  //       this.getCalories(randomNum);
  //     }, 500);
  // }



}
