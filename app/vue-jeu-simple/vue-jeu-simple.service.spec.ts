/*
import { TestBed } from "@angular/core/testing";
import SpyObj = jasmine.SpyObj;
import {platformBrowserDynamicTesting, BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import { Guid } from "guid-typescript";
import { Game, GameType } from "../../../../common/game";
import {AuthService} from "../user/auth.service";
import { VueJeuSimpleService } from "./vue-jeu-simple.service";

const SIZE: number = 3;
const NAME: number = 2;

describe("VueJeuSimpleService", () => {
    let vueJeuSimpleService: VueJeuSimpleService;
    const authService: SpyObj<AuthService> =
      jasmine.createSpyObj("AuthService", {
        "userName": "Anonymous",
    });

    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
                                  platformBrowserDynamicTesting());
      void TestBed.configureTestingModule({
        providers: [
          {provide: AuthService, useValue: authService},
        ],
      });

      vueJeuSimpleService = TestBed.get(VueJeuSimpleService);
    });

    it("should be created", () => {
        void expect(vueJeuSimpleService).toBeTruthy();
    });

    describe("setScores function", () => {
        it ("should modified the score board", () => {
            const TIME1_MIN: number = 1;
            const TIME1_SEC: number = 0;
            const TIME2_MIN: number = 2;
            const TIME2_SEC: number = 30;
            const TIME3_MIN: number = 3;
            const TIME3_SEC: number = 45;
            const id: string = Guid.create().toString();
            const game: Game = {
                id: id,
                parentID: id,
                type: GameType.game,
                name: name,
                bestTimeSolo: [[TIME1_MIN, TIME1_SEC, "default"], [TIME2_MIN, TIME2_SEC, "default"], [TIME3_MIN, TIME3_SEC, "default"]],
                bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
            };
            const newScore: number = 120;
            const expectedResult: (number|string)[][] = [[TIME1_MIN, TIME1_SEC, "default"], [TIME2_MIN, 0, "test"],
                                                         [TIME2_MIN, TIME2_SEC, "default"]];
            vueJeuSimpleService.setScores(game, newScore);
            void expect(game.bestTimeSolo).toEqual(expectedResult);
        });
    });

    describe("getSeconds function", () => {
        it("0:30 should return 30 seconds", () => {
            const TEST_SECONDS: number = 30;
            void expect(vueJeuSimpleService.getSeconds(0, TEST_SECONDS)).toEqual(TEST_SECONDS);
        });
        it("2:30 should return 150 seconds", () => {
            const TEST_SECONDS: number = 30;
            const TEST_MINUTES: number = 2;
            const expectedResult: number = 150;
            void expect(vueJeuSimpleService.getSeconds(TEST_MINUTES, TEST_SECONDS)).toEqual(expectedResult);
        });
        it("0:00 should return 0 seconds", () => {
            void expect(vueJeuSimpleService.getSeconds(0, 0)).toEqual(0);
        });
    });

    describe("sort function", () => {
        it("if new time is the worst, shouldn't change scores", () => {
            const id: string = Guid.create().toString();
            const game: Game = {
                id: id,
                parentID: id,
                type: GameType.game,
                name: name,
                bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
                bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
            };
            const first: number = 60;
            const second: number = 120;
            const third: number = 180;
            const newScore: number = 240;
            vueJeuSimpleService.sort(game, newScore, first, second, third);
            let expectedResult: boolean = true;
            for (let i: number = 0; i < SIZE; i++) {
                if (game.bestTimeSolo[i][NAME] !== "default") {
                    expectedResult = false;
                }
            }
            void expect(expectedResult).toEqual(true);
        });

        it("if new time is 3th, should change scores", () => {
            const id: string = Guid.create().toString();
            const game: Game = {
                id: id,
                parentID: id,
                type: GameType.game,
                name: name,
                bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
                bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
            };
            const first: number = 60;
            const second: number = 120;
            const third: number = 180;
            const newScore: number = 179;
            vueJeuSimpleService.sort(game, newScore, first, second, third);
            void expect(game.bestTimeSolo[NAME][NAME]).toEqual("test");
        });

        it("if new time === 2th, new score should be in 3th place", () => {
            const id: string = Guid.create().toString();
            const game: Game = {
                id: id,
                parentID: id,
                type: GameType.game,
                name: name,
                bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
                bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
            };
            const first: number = 60;
            const second: number = 120;
            const third: number = 180;
            const newScore: number = 120;
            vueJeuSimpleService.sort(game, newScore, first, second, third);
            void expect(game.bestTimeSolo[NAME][NAME]).toEqual("test");
        });

        it("if new time is 2, should change scores", () => {
            const id: string = Guid.create().toString();
            const game: Game = {
                id: id,
                parentID: id,
                type: GameType.game,
                name: name,
                bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
                bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
            };
            const first: number = 60;
            const second: number = 120;
            const third: number = 180;
            const newScore: number = 119;
            vueJeuSimpleService.sort(game, newScore, first, second, third);
            void expect(game.bestTimeSolo[1][NAME]).toEqual("test");
        });

        it("if new time is 1st, should change scores", () => {
            const id: string = Guid.create().toString();
            const game: Game = {
                id: id,
                parentID: id,
                type: GameType.game,
                name: name,
                bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
                bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
            };
            const first: number = 60;
            const second: number = 120;
            const third: number = 180;
            const newScore: number = 59;
            vueJeuSimpleService.sort(game, newScore, first, second, third);
            void expect(game.bestTimeSolo[0][NAME]).toEqual("test");
        });
    });

    describe("changeScores function", () => {
        it("should change the score board of the game card", () => {
            const TIME1: number = 60;
            const TIME2: number = 120;
            const TIME3: number = 181;

            const id: string = Guid.create().toString();
            const game: Game = {
                id: id,
                parentID: id,
                type: GameType.game,
                name: name,
                bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
                bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
            };
            const newScore: number[] = [TIME1, TIME2, TIME3];
            const TWO: number = 2;
            const TREE: number = 3;
            const expectedResult: (number|string)[][] = [[1, 0, "default"], [TWO, 0, "default"], [TREE, 1, "default"]];
            vueJeuSimpleService.changeScores(game, newScore, ["Default", "Default", "Default"]);
            void expect(game.bestTimeSolo).toEqual(expectedResult);
        });
    });
});
*/