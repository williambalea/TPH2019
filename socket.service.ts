import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { environment } from "../environments/environment";
import {GameMessage} from "./messages/game-message";
import {MessageService} from "./messages/message.service";
//import { WaitingRoomComponent } from "./waiting-room/waiting-room.component";
import { WaitingRoomService } from "./waiting-room/waiting-room.service";
import { Game } from "../../../common/game";

@Injectable({
    providedIn: "root",
})
export class WebSocketService {

    // Our socket connection
    public socket: SocketIOClient.Socket;

    public constructor(private messageService: MessageService, public waitingRoomService: WaitingRoomService) {
        this.socket = io(environment.ws_url);

        this.socket.on("newConnection", (userName: string) => {
          this.messageService.addConnectionMessage(userName, new Date());
        });

        this.socket.on("newDisconnection", (userName: string) => {
          this.messageService.addDisconnectionMessage(userName, new Date());
        });

        this.socket.on("newRecordMsg", (gameMsg: GameMessage) => {
          gameMsg.date = new Date();
          this.messageService.addNewRecordMessage(gameMsg);
        });

        this.socket.on("deleteGame2D", (game: Game) => {
          this.waitingRoomService.deletedGame(game);
        })
    }

    public emit<T>(eventName: string, data: T): void {
        this.socket.emit(eventName, data);
    }

    public on(eventName: string, fn: Function): void {
        this.socket.on(eventName, fn);
    }

}
