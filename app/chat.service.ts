/* import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { WebSocketService } from "./socket.service";

@Injectable({
    providedIn: "root",
})
export class ChatService {

    // tslint:disable-next-line:no-any
    public messages: Subject<any>;
    // tslint:disable-next-line:no-any
    public disconnect: Subject<any>;

    // Our constructor calls our wsService connect method
    public constructor(private wsService: WebSocketService) {

        this.messages = this.wsService
            .connect().pipe(
                // tslint:disable-next-line:no-any
                map((response: any): any => {
                    return response;
                }),
                // tslint:disable-next-line:no-any
            ) as Subject<any>;
    }

  // Our simplified interface for sending
  // messages back to our socket.io server
  // tslint:disable-next-line:typedef
  // tslint:disable-next-line:no-any
    public sendMsg(msg: any): void {
        this.messages.next(msg);
    }
}
 */