import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Messages, ServerResponse } from "../../../../common/communication/auth-communication";

import { WebSocketService } from "../socket.service";

const httpOptions: {headers: HttpHeaders} = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const BASE_PATH: string = "http://localhost:3000";
const USER_DETAILS_URL: string = BASE_PATH.concat("/userDetails");
const DELETE_USER_URL: string = BASE_PATH.concat("/deleteUser");

@Injectable({
  providedIn: "root",
})
export class AuthService {

    public userName: string;
    public isAuthenticated: boolean ;
    public isDeleted: boolean;
    private authState: any;

    public constructor(private http: HttpClient, private socketService: WebSocketService) {
        this.userName = "";
        this.isAuthenticated = false;
        this.isDeleted = false;
        // this.user = this.afAuth.authState;
    }

    public async getUsersList(): Promise<string[] | Observable<Error>> {
        return this.http.get<string[]>(USER_DETAILS_URL)
                .toPromise()
                .catch( (error) => this.handleError(error));
    }

    public async registerUser(user: string): Promise<void | Observable<Error> > {
        return this.http.post<ServerResponse>(USER_DETAILS_URL, {userName: user}, httpOptions)
        .toPromise()
        .then( (message) => {
                // Check all the possible messages sent by the server
                if ( (message.serverResponse) === Messages.USERNAME_APPROOVED_SERVER_RESPONSE ) {
                    this.userName = user;
                    this.isAuthenticated = true;
                    // will link client socket id with current user name
                    this.socketService.emit("userName", this.userName);
                }
                if ( (message.serverResponse) === Messages.USERNAME_REFUSED_SERVER_RESPONSE ) {
                    this.userName = "";
                    this.isAuthenticated = false;
                }
                if ( (message.serverResponse) === Messages.USERNAME_NON_AVAILABLE ) {
                    this.userName = "";
                    this.isAuthenticated = false;
                }
            })
        .catch( (error) => this.handleError(error) );
    }

    public async deleteUser(): Promise<boolean> {
        return this.http.post<string>(DELETE_USER_URL, {userName: this.userName}, httpOptions)
        .pipe(catchError(this.handleError))
        .toPromise()
        .then( () => this.isDeleted = true);
    }

    private handleError(error: HttpErrorResponse): Observable<Error> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }

        // return an observable with a user-facing error message
        return throwError(
            "Something bad happened; please try again later.");
    }

    public get currentUserId(): string {
        return this.authState !== null ? this.authState.uid : "";
      }

  }
