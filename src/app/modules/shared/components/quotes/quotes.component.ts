import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { QuotesService } from "../../../admin/modules/quotes/components/quotes/quotes.service";
import { Quotes } from "../../../../models/quotes/quotes.model";

@Component({
  selector: 'app-client-quotes',
  templateUrl: './quotes.component.html'
})

export class QuotesComponent {

  public loadingBox: boolean = false;
  public quote: Quotes;

  constructor(
    public _quotesService: QuotesService
  ) {
    this.quote = new Quotes;
  }

  ngOnInit() {
    this.getQuote();
  }

  public getQuote(): void {
    this.loadingBox = true;
    this._quotesService.getQuote().subscribe(
      (data: any) => {
        this.loadingBox = false;
        this.quote = data.quote;
      }
    )
  }


}
