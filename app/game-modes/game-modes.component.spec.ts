import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule, MatDialogModule, MatDividerModule, MatFormFieldModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { AdminTopMenuComponent } from "../admin-top-menu/admin-top-menu.component";
import { AppRoutingModule } from "../app-routing.module";
import { Geometric3dSceneComponent } from "../geometric3d-scene/geometric3d-scene.component";
import { SvCreationPopupComponent } from "../sv-creation-popup/sv-creation-popup.component";
import { UserComponent } from "../user/user.component";
import { VueJeuSimpleComponent } from "../vue-jeu-simple/vue-jeu-simple.component";
import { GameModesComponent } from "./game-modes.component";
import { WaitingRoomComponent } from "../waiting-room/waiting-room.component"
import { MessagesComponent } from "../messages/messages.component";

import { Guid } from "guid-typescript";
import { of } from "rxjs";
import { Message } from "../../../../common/communication/message";
import { Game } from "../../../../common/game";
import { Game2D } from "../../../../common/game2D";

const testDisplayNumber1: number = 5;
const testDisplayNumber2: number = 15;

describe("GameModesComponent", () => {
    let component: GameModesComponent;
    let fixture: ComponentFixture<GameModesComponent>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    const game1: Game2D = {
        id: Guid.create().toString(),
        parentID: "",
        type: 1,
        name: "mode en vue simple",
        image: "http://localhost:3000/image1_1.bmp",
        modifiedImage: "http://localhost:3000/image1_2.bmp",
        differencesImage: "./app/imagesDeDifferences/imagesBMP/mode en vue simple.bmp",
        bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
        bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
    };
    const game2: Game = {
        id: Guid.create().toString(),
        parentID: "",
        type: 2,
        name: "mode en vue libre",
        bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
        bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
    };

    const game3: Game2D = {
        id: Guid.create().toString(),
        parentID: "",
        type: 1,
        name: "test",
        image: "../../assets/imagesBMP/image5_1.bmp",
        modifiedImage: "../../assets/imagesBMP/image5_3.bmp",
        differencesImage: "a modifier",
        bestTimeSolo: [[], [], []],
        bestTime1v1: [[], [], []],
    };


    const message: Message = {
        title: "test",
        body: "test",
    };

    const games: Game[][] = [[game1], [game2]];

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["post", "get"]);
        httpClientSpy.get.and.returnValue(of(games));
        httpClientSpy.post.and.returnValue(of(message));
        void TestBed.configureTestingModule({
        declarations: [
            GameModesComponent,
            SvCreationPopupComponent,
            AdminTopMenuComponent,
            UserComponent,
            VueJeuSimpleComponent,
            Geometric3dSceneComponent,
            WaitingRoomComponent,
            MessagesComponent,
        ],
        imports: [ MatCardModule, MatDividerModule,
                   MatFormFieldModule,
                   MatDialogModule,
                   FormsModule,
                   ReactiveFormsModule,
                   HttpClientModule,
                   RouterModule,
                   AppRoutingModule,
        ],
        providers: [
             {provide: HttpClient, useValue: httpClientSpy},
        ],
        }).compileComponents();
        fixture = TestBed.createComponent(GameModesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe ("displayNumber function : ", () => {
        it("x < 10 should return 0x", () => {
            expect(component.displayNumber(testDisplayNumber1)).toEqual("05");
        });
        it("x > 10 should return x", () => {
            expect(component.displayNumber(testDisplayNumber2)).toEqual("15");
        });
    });

    it ("setSelectedGame : call count should be at 1 for 2D game", () => {
        const expectedMessage: Message = { body: "2D", title: "test" };
        const CALL_COUNT: number = 1;
        httpClientSpy.post.and.returnValue(of(expectedMessage));
        component.setSelectedGame(game1, 0);
        expect(httpClientSpy.post.calls.count()).toEqual(CALL_COUNT);
    });

    it ("setSelectedGame: should work even if we press create button", () => {
        const expectedMessage: Message = { body: "2D", title: "test" };
        const CALL_COUNT: number = 1;
        httpClientSpy.post.and.returnValue(of(expectedMessage));
        component.setSelectedGame(game1, 1);
        expect(httpClientSpy.post.calls.count()).toEqual(CALL_COUNT);
    })

    it ("setSelectedGame : call count should be at 1 for for 3D game", () => {
        const expectedMessage: Message = { body: "3D", title: "test" };
        const CALL_COUNT: number = 1;
        httpClientSpy.post.and.returnValue(of(expectedMessage));
        component.setSelectedGame(game2, 1);
        expect(httpClientSpy.post.calls.count()).toEqual(CALL_COUNT);
    })


    it ("resetScores : call count should be at 1", () => {
        component.games = [[game1], [game2]];
        const expectedMessage: Message = { body: "Hello", title: "World" };
        httpClientSpy.post.and.returnValue(of(expectedMessage));
        component.resetScores(game1);
        expect(httpClientSpy.post.calls.count()).toEqual(1);
    });

    
    it ("if 2D game is there, request should work", () => {
        const expectedMessage: Message = { body: "file found and removed from 2D liste", title: "deleteGame2D" };
        httpClientSpy.post.and.returnValue(of(expectedMessage));
        component.games = [[game1], [game2]];
        const returnMessage: string = component.deleteCard(game1);
        expect(returnMessage).toEqual("file found and removed from 2D liste");
    });
    
    it ("if the game is a 3D game, should delete it from the 3D list", () => {
        const expectedMessage: Message = { body: "file found and removed from 3D liste", title: "deleteGame3D" };
        httpClientSpy.post.and.returnValue(of(expectedMessage));
        
        component.games = [[game1], [game2]];
        const returnMessage: string = component.deleteCard(game2);
        expect(returnMessage).toEqual("file found and removed from 3D liste");
    });

    it ("should return message even if there is no game", () => {
        component.games = [];
        const expectedMessage: Message = { body: "Game not found", title: "deleteGame3D" };
        httpClientSpy.post.and.returnValue(of(expectedMessage));

        const returnMessage: string = component.deleteCard(game2);
        expect(returnMessage).toEqual("Game not found");
    })
    
    it ("if game isnt in the list, should return error", () => {
        // à modifier
       //  component.games = [[game1], [game2]];
        // component.games3D = [game1];
        component.games = [[game1], [game2]];
        const expectedMessage: Message = { body: "Hello", title: "World" };
        httpClientSpy.post.and.returnValue(of(expectedMessage));

        const returnMessage: string = component.deleteCard(game3);
        expect(returnMessage).toEqual("Game not found");
    });

    it ("get game sheets should return games on server", () => {
        // à modifier
        component.games = [[game1], [game2]];
        // component.games = [[game1], [game2]];
        httpClientSpy.get.and.returnValue(of(games));
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

});
