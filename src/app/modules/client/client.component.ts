import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ModalService } from "src/app/services/modal/modal.service";
import { ModalComponent } from "../shared/components/modal/modal.component";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.css"],
})
export class ClientComponent implements OnInit {
  constructor(private modalService: ModalService, private dialog: MatDialog) {}

  ngOnInit() {
    this.modalService.modalOpened.subscribe((data) => {
      this.dialog
        .open(ModalComponent, {
          panelClass: "modile_dialog_container",
          data,
        })
        .afterClosed()
        .subscribe((res) => {
          this.modalService.closeModal(res);
        });
    });
  }
  openSideBar() {
    // this._opened = !this._opened;
    // alert('hello');
    jQuery("#main-container").toggleClass("opening");
    jQuery("#side_navbox").toggleClass("opening");
    jQuery("#right-sidebar").toggleClass("opening");
    jQuery("#footer-margin").toggleClass("opening");
  }
}
