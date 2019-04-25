import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Message } from "../../../../common/communication/message";

@Injectable()
export class GameModeService {

    private GET_GAMES_URL: string = "http://localhost:3000/";

    public constructor(private http: HttpClient) { }

    public getGames(): Observable<Object> {
        return this.http.get(this.GET_GAMES_URL + "getGames").pipe(
            catchError(this.handleError<Message>("getGames failed")),
        );
    }

    ////////////
    /*
    public getGames2D(): Observable<Object> {
        return this.http.get(this.GET_GAMES_URL + "getGames2D").pipe(
            catchError(this.handleError<Message>("getGames2D failed")),
        );
    }
    public getGames3D(): Observable<Object> {
        return this.http.get(this.GET_GAMES_URL + "getGames3D").pipe(
            catchError(this.handleError<Message>("getGames3D failed")),
        );
    }
    */
    /////////////

    public post<T>(url: string, data: T): Observable<Message> {
        return this.http.post<Message>(this.GET_GAMES_URL + url, data).pipe(
            catchError(this.handleError<Message>("post failed")),
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
