import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { MembershipsService } from './memberships.service';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { Memberships } from "../../../../../../models/memberships/memberships.model";

@Component({
  selector: 'app-contents',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.css']
})
export class MembershipsComponent implements OnInit {

  public memberships: Memberships[];
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions;
  public isModalMemberships: boolean = false;
  public membership: Memberships;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(
    public _membershipsService: MembershipsService
  ) {
    this.membership = new Memberships;
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": " "
      }
    };
    this.listMemberships();
  }


  /**
   * Obtiene lista de membresias
   *
   * @return void
   */
  public listMemberships(): void {
    this._membershipsService.getMemberships().subscribe(
      data => {
        this.memberships = data;
        this.dtTrigger.next();
      }
    )
  }


  /**
 * Destruye instancia activa DataTables
 *
 * @return void
 */
  public destroyDtInstance(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      dtInstance.destroy();
    });
  }



  /**
   * Abre modal de configuración de categorías
   *
   * @param  pack   Objecto de la lista de categorias a editar
   * @return void
   */
  public openModalMemberships(item: Memberships): void {
    this.membership.id = item.id;
    this.membership.title = item.title;
    this.membership.price = item.price;

    this.isModalMemberships = true;
  }


  /**
   * Oculta modal de edición de categorías
   *
   * @return void
   */
  public hideModalMemberships(): void {
    this.isModalMemberships = false;
  }


  /**
   * Guarda categoría
   *
   * @return void
   */
  public saveMembership() {
    this._membershipsService.putMemberships(this.membership).subscribe(
      data => {
        this.destroyDtInstance();
        this.listMemberships();
        this.hideModalMemberships();
      }
    )
  }


}
