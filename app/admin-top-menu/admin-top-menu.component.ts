import { Component } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { FvCreationPopupComponent } from "../fv-creation-popup/fv-creation-popup.component";
import { SvCreationPopupComponent } from "../sv-creation-popup/sv-creation-popup.component";

@Component({
  selector: "app-admin-top-menu",
  templateUrl: "./admin-top-menu.component.html",
  styleUrls: ["./admin-top-menu.component.css", "../game-modes/game-modes.component.css"],
})

export class AdminTopMenuComponent {

  public constructor(public dialog: MatDialog) {}

  public openSvDialog(): void {
    try {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      this.dialog.open(SvCreationPopupComponent, dialogConfig);

    } catch (error) {
        alert("La vue simple n'a pas pu s'ouvrir");
    }
  }

  public openFvDialog(): void {
    try {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      this.dialog.open(FvCreationPopupComponent, dialogConfig);
    } catch (error) {
        alert("La vue libre n'a pas pu s'ouvrir");
      }
  }
}
