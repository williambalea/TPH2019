import { Injectable } from "@angular/core";
import {GameMessage} from "./game-message";

@Injectable({
  providedIn: "root",
})
export class MessageService {

  // messages to append
  public static readonly JUST_CONNECTED: string = " vient de se connecter";
  public static readonly JUST_DISCONNECTED: string = " vient de se déconnecter";
  public static readonly DIFFERENCE_FOUND: string = "Différence trouvée";
  public static readonly ERROR: string = "Erreur";
  public static readonly OVERLINE: string = " - ";
  // strings to append for newRecordMsg
  public static readonly GET_THE: string = " obtient la ";
  public static readonly POSITION_IN_BEST_TIMES_OF_GAME: string = " place dans les meilleurs temps du jeu ";
  public static readonly IN: string = " en ";
  public static readonly DOT: string = ".";
  // for formatDate
  public static readonly TWO_POINTS: string = ":";

  private messages: string[];

  public constructor() {
    this.messages = [];
  }

  public clear(): void {
    this.messages = [];
  }

  public send(message: string): void {
    this.messages.push(message);
  }

  public getMessages(): string[] {
    return this.messages;
  }

  public addConnectionMessage(userName: string, date: Date): void {
    this.messages.push(this.formatDate(date) + MessageService.OVERLINE + userName + MessageService.JUST_CONNECTED);
  }

  public addDisconnectionMessage(userName: string, date: Date): void {
    this.messages.push(this.formatDate(date) + MessageService.OVERLINE + userName + MessageService.JUST_DISCONNECTED);
  }

  public addDifferenceFoundMessage(date: Date): void {
    this.messages.push(this.formatDate(date) + MessageService.OVERLINE + MessageService.DIFFERENCE_FOUND);
  }

  public addIdentificationErrorMessage(date: Date): void {
    this.messages.push(this.formatDate(date)  +  MessageService.OVERLINE + MessageService.ERROR);
  }

  public addNewRecordMessage(gameMsg: GameMessage): void  {
    this.messages.push(this.formatDate(gameMsg.date) + MessageService.OVERLINE + gameMsg.userNameAuthor +
      MessageService.GET_THE + gameMsg.position + MessageService.POSITION_IN_BEST_TIMES_OF_GAME +
      gameMsg.gameName + MessageService.IN + gameMsg.numberOfPlayers + MessageService.DOT);
  }

  private formatDate(date: Date): string {

    const seconds: number = date.getSeconds();
    const minutes: number = date.getMinutes();
    const hours: number = date.getHours();

    return this.formatNumber(hours) + MessageService.TWO_POINTS +
      this.formatNumber(minutes) + MessageService.TWO_POINTS +
      this.formatNumber(seconds);
  }

  public formatNumber(num: number): string {
    const ten: number = 10;
    if (num < ten) {
      return "0" + num;
    } else {
      return num.toString();
    }
  }
}
