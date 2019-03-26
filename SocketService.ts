import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import {GameMessage} from "../../client/src/app/messages/game-message";
import { Game } from "../../common/game";
import { Application } from "./app";
import { Data } from "./data";
import Types from "./types";

// tslint:disable:no-console
@injectable()
export class SocketService {

    private http: http.Server;
    private io: SocketIO.Server ;
    private readonly SOCKET_PORT: number = 5000;

    private myMap: Map<string, string > =  new Map<string, string>() ;

    public constructor(@inject(Types.Application) private application: Application) {
        this.http = require("http").Server(this.application.app);
        this.io = require("socket.io")(this.http);
    }

    public setUpConnection(): void {

        // tslint:disable-next-line:max-func-body-length
        this.io.on("connection", (socket: SocketIO.Socket) => {
            const socketID: string = socket.id;

            console.log("user connected with socket id : " + socketID);

            // Log whenever a client disconnects from our websocket server
            socket.on("disconnect", () => {

                console.log("user disconnected");
                console.log("deleted socketID: " + socketID );
                console.log("associated with userName: " + this.myMap.get(socketID) as string);

                const index: number = Data.userNames.indexOf(this.myMap.get(socketID) as string);
                if (index !== -1) {
                    Data.userNames.splice(index, 1);
                }
                socket.broadcast.emit("newDisconnection", this.myMap.get(socketID) as string);
                this.myMap.delete(socketID);
            });

            // When we receive a 'message' event from our client, print out
            // the contents of that message and then echo it back to our client
            // using `io.emit()`
            socket.on("message", (message: string) => {
                console.log("Message Received: " + message);
                this.io.emit("message", { type: "new-message", text: message });
            });

            socket.on("userName", (userName: string) => {
                this.myMap.set(socketID, userName);
                console.log("userName socket.id : " + socketID + " and userName is : " + userName);
                socket.broadcast.emit("newConnection", userName);
            });

            socket.on("newRecordBroadcastMsg", (gameMsg: GameMessage) => {
                socket.broadcast.emit("newRecordMsg", gameMsg) ;
            });

            socket.on("deleteGame2D", (game: Game) => {
                socket.broadcast.emit("deleteGame2D", game);
            });
        });

        this.http.listen(this.SOCKET_PORT, () => {
            console.log("started on port 5000");
        });

    }
}
