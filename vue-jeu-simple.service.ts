import { Injectable } from "@angular/core";
import { Game } from "../../../../common/game";
import {AuthService} from "../user/auth.service";

enum pos {first, second, third}
const FIRST: string = "première";
const SECOND: string = "deuxième";
const THIRD: string = "troisième";

const NAME: number = 2;
const MINUTE: number = 60;

@Injectable({
    providedIn: "root",
})
export class VueJeuSimpleService {

    private scoreInTopThree: boolean;
    private position: string;

    public constructor(private authService: AuthService) {
      this.scoreInTopThree = false;
      this.position = "";
    }

    public setScores(game: Game, newScore: number): void {
        const firstScore: number = this.getSeconds(Number(game.bestTimeSolo[pos.first][0]),
                                                   Number(game.bestTimeSolo[pos.first][1]));
        const secondScore: number = this.getSeconds(Number(game.bestTimeSolo[pos.second][0]),
                                                    Number(game.bestTimeSolo[pos.second][1]));
        const thirdScore: number = this.getSeconds(Number(game.bestTimeSolo[pos.third][0]),
                                                   Number(game.bestTimeSolo[pos.third][1]));
        this.sort(game, newScore, firstScore, secondScore, thirdScore);
    }

    public getSeconds(minute: number, second: number): number {
        return minute * MINUTE + second;
    }

    public sort(game: Game, newScore: number, firstScore: number, secondScore: number, thirdScore: number): void {
        let newScores: number[];
        let newUsers: string[];
        const user1: string = game.bestTimeSolo[pos.first][NAME].toString();
        const user2: string = game.bestTimeSolo[pos.second][NAME].toString();
        const user3: string = game.bestTimeSolo[pos.third][NAME].toString();
        this.scoreInTopThree = true;
        if (newScore < firstScore) {
            newScores = [newScore, firstScore, secondScore];
            newUsers = [this.authService.userName, user1, user2];
            this.position = FIRST;
        } else if (newScore < secondScore) {
            newScores = [firstScore, newScore, secondScore];
            newUsers = [user1, this.authService.userName, user2];
            this.position = SECOND;
        } else if (newScore < thirdScore) {
            newScores = [firstScore, secondScore, newScore];
            newUsers = [user1, user2, this.authService.userName];
            this.position = THIRD;
        } else {
            newScores = [firstScore, secondScore, thirdScore];
            newUsers = [user1, user2, user3];
            this.scoreInTopThree = false;
        }
        this.changeScores(game, newScores, newUsers);
    }

    public changeScores(game: Game, newScores: number[], newUsers: string[]): void {
        for (let i: number = 0; i <= pos.third; i++) {
            game.bestTimeSolo[i][0] = Math.floor(newScores[i] / MINUTE);
            game.bestTimeSolo[i][1] = newScores[i] % MINUTE;
            game.bestTimeSolo[i][NAME] = newUsers[i];
        }
    }

    public isInTopThree(): boolean {
      return this.scoreInTopThree;
  }

    public getPosition(): string {
      return this.position;
  }

}
