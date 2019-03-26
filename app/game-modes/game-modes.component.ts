import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameSheetGenerator } from "../../../../common/communication/gameSheetGenerator";
import { Message } from "../../../../common/communication/message";
import { Game } from "../../../../common/game";
import { Game2D } from "../../../../common/game2D";
import { Game3DGeo } from "../../../../common/game3DGeo";
import { GameModeService } from "./game-mode.service";
import { WebSocketService } from "../socket.service";

import {MessageService } from "../messages/message.service";
import { AuthService } from "../user/auth.service";

const nbDisplay: number = 10;

@Component({
    selector: "app-game-modes",
    templateUrl: "./game-modes.component.html",
    styleUrls: ["./game-modes.component.css"],
})
export class GameModesComponent implements OnInit {

    public readonly GAME_NAME_2D: string = "mode en vue simple";
    public readonly GAME_NAME_3D: string = "mode en vue libre";

    public games: Game[][];
    public game: Game;
    public games2D: Game2D[];
    public games3D: Game3DGeo[];
    public generator: GameSheetGenerator;
    public currentGame: Game;
    public gameModeService: GameModeService;

    public constructor( public router: Router,
                        public http: HttpClient,
                        public messageService: MessageService,
                        public authService: AuthService,
                        private socketService: WebSocketService) {}

    public ngOnInit(): void {
        this.gameModeService = new GameModeService(this.http);
        this.generator = new GameSheetGenerator();
        this.getGameSheets();
    }

    public getGameSheets(): void {
        
        ////////////////////
        /*
        this.gameModeService.getGames2D().subscribe((games2D: Game2D[]) => {
            this.games[0] = games2D;
            // tslint:disable-next-line:no-console
        });
        this.gameModeService.getGames3D().subscribe((games3D: Game3DGeo[]) => {
            this.games[1] = games3D;
        });
        */
        /////////////////////
        this.gameModeService.getGames().subscribe((games: Game[][]) => {
            this.games = games;
        })
    }

    public goToVueJeuSimple(): void {
        void this.router.navigate(["/", "vueJeuSimple"] ) ;
        this.messageService.clear();
    }

    public goToVueJeuSimpleDuo(): void {
        void this.router.navigate(["/", "vueJeuSimpleDuo"] ) ;
        this.messageService.clear();
    }

    public goToVueJeuLibre(): void {
        void this.router.navigate(["/", "scene3d"])
    }

    public deleteCard(game: Game): string {
        let message: Message = {title: "error", body: "Game not found"};
        for (let i: number = 0; i < this.games.length; i++) { 
            for (let j: number = 0; j < this.games[i].length; j++) {
                if (game.id === this.games[i][j].id) {
                    if ( i === 0 ) {
                        this.socketService.emit<Game>("deleteGame2D", game);
                        this.gameModeService.post<Game>("deleteGame2D", game).subscribe((resp) => {
                                    message = resp;
                                    this.getGameSheets();
                                    alert(message.body);
                                    return message.body;
                        });
                    } else {
                        this.gameModeService.post<Game>("deleteGame3D", game).subscribe((resp) => {
                                    message = resp;
                                    this.getGameSheets();
                                    alert(message.body);
                                    return message.body;
                        });
                    }
                }
            }

        }
        return message.body;
    }

    /*
    public deleteCard3D(game: Game): string {
        let message: Message = {title: "error", body: "Game not found"};
        for (let j: number = 0; j <= this.games3D.length; j++) {
                 if ( game.name === this.games3D[j].name) {
                    this.gameModeService.post<Game>("deleteGame3D", game).subscribe((resp) => {
                    message = resp;
                    this.getGameSheets();
                });
            }
        }

        return message.body;
    }
    */
    public resetScores(game: Game): void {
        this.gameModeService.post<Game>("resetScores", game).subscribe((resp) => {
            this.getGameSheets();
            alert(resp.body);
        });
    }

    public displayNumber(n: number): String {
        if (n < nbDisplay) {
            return "0" + n;
        }

        return n.toString();
    }

    public setSelectedGame(game: Game, id: number): void {
        this.gameModeService.post<Game>("setSelectedGame", game).subscribe((res) => {
            if (res.body === "2D") {
                if (id === 0) {
                    this.goToVueJeuSimple();
                    this.messageService.addConnectionMessage(this.authService.userName, new Date);
                } else {
                    this.goToVueJeuSimpleDuo();
                    this.messageService.addConnectionMessage(this.authService.userName, new Date);
                }
            }
            else {
                this.goToVueJeuLibre();
            }
        });
    }

}
