
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule,
    MatDividerModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTableModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { Game2D } from "../../../../common/game2D";
import { Guid } from "../../../../server/node_modules/guid-typescript/dist/guid";
import { AdminTopMenuComponent } from "../admin-top-menu/admin-top-menu.component";
import { GameModesComponent } from "../game-modes/game-modes.component";
import { Geometric3dSceneComponent } from "../geometric3d-scene/geometric3d-scene.component";
import { SvCreationPopupComponent } from "../sv-creation-popup/sv-creation-popup.component";
import { UserComponent } from "../user/user.component";
import { AudioPlayerService } from "./audio-player.service";
import { VueJeuSimpleComponent } from "./vue-jeu-simple.component";
import { WaitingRoomComponent } from "../waiting-room/waiting-room.component";
import { MessagesComponent } from "../messages/messages.component";

import { AppRoutingModule } from "../app-routing.module";

//const seconds5000: number = 5000;
//const maxPixelHeight: number = 480;
//const maxPixelWidth: number = 640;

describe("VueJeuSimpleComponent", () => {
    let component: VueJeuSimpleComponent;
    let fixture: ComponentFixture<VueJeuSimpleComponent>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    const id: string = Guid.create().toString();
    const mockGame: Game2D = {
        id: id,
        parentID: id, 
        type: 1,
        name: "mode en vue libre",
        image: "",
        modifiedImage: "",
        differencesImage: "a modifier",
        bestTimeSolo: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
        bestTime1v1: [[0, 0, "default"], [0, 0, "default"], [0, 0, "default"]],
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post"]);

        httpClientSpy.post.and.returnValue(of(true));
        httpClientSpy.get.and.returnValue(of(mockGame));

        void TestBed.configureTestingModule({
            declarations: [
                VueJeuSimpleComponent,
                SvCreationPopupComponent,
                AdminTopMenuComponent,
                GameModesComponent,
                UserComponent,
                Geometric3dSceneComponent,
                WaitingRoomComponent,
                MessagesComponent,
            ],
            imports: [
                MatDialogModule, MatDividerModule, MatTableModule, MatInputModule, MatSelectModule,
                MatFormFieldModule, MatCardModule, MatDialogModule, MatButtonModule, MatCheckboxModule,
                ReactiveFormsModule, FormsModule, RouterModule, HttpClientModule, AppRoutingModule,
            ],
            providers: [
                AudioPlayerService,
                { provide: HttpClient, useValue: httpClientSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VueJeuSimpleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    
    it("should increment ndDiff", () => {
        httpClientSpy.post.and.returnValue(of([[0,0]]));
        const event: MouseEvent = new MouseEvent("click");
        const nbDiffValidation: number = 0;

        component.pointFound = new Array();
        component.clickImage(event);
        
        //expect(httpClientSpy.post).toHaveBeenCalled();
        expect(component.pointFound.length).toEqual(nbDiffValidation + 1);
    });
    /*
    it ("if n >= 10, should return n", () => {
        const TEST: number = 10;
        expect(component.displayNumber(TEST)).toEqual("10");
    });
    it ("if n < 10, should return 0n", () => {
        expect(component.displayNumber(1)).toEqual("01");
    });

    it ("x = 0 and y = 0, should return [0,0]", () => {
        expect(component.convertPosition(0, 0)).toEqual([0, 0]);
    });
    it ("x = -1 and y = -1, should return [0,0]", () => {
        expect(component.convertPosition(-1, -1)).toEqual([0, 0]);
    });
    it ("x = 5000 and y = 5000, should return [639,479]", () => {
        expect(component.convertPosition(seconds5000, seconds5000)).toEqual([maxPixelWidth - 1, maxPixelHeight - 1]);
    });

    
    it ("after 5 seconds, timer should be 00:05", () => {
        const HALF_SECOND: number = 500;
        void component.delay(HALF_SECOND);
        setTimeout(() => {
            expect(component.seconds).toEqual("05");
        },         seconds5000);
    });
    */
});
