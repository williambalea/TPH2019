import { Injectable } from '@angular/core';
import { Game } from "../../../../common/game";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class WaitingRoomService {
    public selectedGame: Game;

    constructor(public router: Router) { }

    public deletedGame(deletedGame: Game): void {
        if (this.selectedGame.parentID === deletedGame.parentID) {
            alert("selected game has been deleted");
            this.goToGameModeView();
        }
    }

    public setSelectedGame(game: Game): void {
        this.selectedGame = game;
    }

    public goToGameModeView(): void {
        void this.router.navigate(["/", "game-modes"] ) ;
    }
}
