import { Component, OnInit, ViewChild } from '@angular/core';

import { QuotesService } from './quotes.service';

import { Quotes } from "../../../../../../models/quotes/quotes.model";

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {

  public loadingBox: boolean;
  public isEdit: boolean = false;
  public list: Quotes[];
  public fields: Quotes;
  public options = {
    maxDepth: 1
  };


  constructor(
    public _quotesService: QuotesService
  ) {
    this.list = [];
    this.fields = new Quotes;
  }

  ngOnInit() {
    this.getQuotes();
  }

  public setQuote() {
    let quote = new Quotes;
    quote.referer = this.getNumberRand();
    quote.author = this.fields.author;
    quote.phrase = this.fields.phrase;

    this.list.push(quote);
    this.list = [...this.list];
    this.isEdit = false;

    this.fields.author = "";
    this.fields.phrase = "";
  }

  public trashQuote(item) {
    this.list.splice(this.list.indexOf(item), 1);
  }

  public toEdit(item) {
    this.fields.id = this.list.indexOf(item);
    this.fields.author = item.author;
    this.fields.phrase = item.phrase;
    this.isEdit = true;
  }

  public updateQuote(item) {
    this.list[item.id].author = item.author;
    this.list[item.id].phrase = item.phrase;
    this.isEdit = false;

    this.fields.author = "";
    this.fields.phrase = "";
  }

  public emptyList() {
    this.list = [];
    this.list = [...this.list];
  }


  public saveQuotes(): void {
    this.loadingBox = true;
    this._quotesService.postQuotes(this.list).subscribe(
      data => {
        this.loadingBox = false;
        this.getQuotes();
      }
    )
  }

  public getQuotes(): void {
    this.loadingBox = true;
    this._quotesService.getQuotes().subscribe(
      data => {
        this.loadingBox = false;
        this.list = data;
      }
    )
  }



  /**
   * Genera cadena numerica aleatoria
   *
   * @return number
   */
  public getNumberRand() {
    return Math.round((new Date()).getTime());
  }


}
