import { Component, OnInit } from '@angular/core';
import { Game } from '../../../../common/game';
import { HttpClient } from "@angular/common/http";
import { WaitingRoomService } from "./waiting-room.service";
//import { SelectedGame } from "../vue-jeu-simple/selected-game";
//import { WebSocketService } from "../socket.service";

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {
    public selectedGame: Game;

    constructor(public http: HttpClient, public waitingRoomService: WaitingRoomService) {
        this.http.get("http://localhost:3000/getSelectedGame").subscribe((game: Game) => {
            this.selectedGame = game;
            this.waitingRoomService.setSelectedGame(game);
        });
    }

    ngOnInit() {
    }

}
