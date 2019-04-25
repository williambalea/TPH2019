import { HttpClient } from "@angular/common/http";
import { Component, HostListener, OnInit, ElementRef, ViewChild  } from "@angular/core";
import { Router } from "@angular/router";
import { Guid } from "guid-typescript";
import { Game2D } from "../../../../common/game2D";
import {GameMessage} from "../messages/game-message";
import {MessageService} from "../messages/message.service";
import {WebSocketService} from "../socket.service";
import { AuthService } from "../user/auth.service";
import { AudioPlayerService } from "./audio-player.service";
import { VueJeuSimpleService } from "./vue-jeu-simple.service";
import { ErrorIdentificationService } from "./error-identification.service"

const HALF_SECOND: number = 500;
const SECOND: number = 1000;
const MINUTE: number = 60;
const HOUR: number = 60;
const TEN: number = 10;
const DIFFWANTED: number = 7;

enum currentMode { modeSolo, mode1v1 }
@Component({
    selector: "app-vue-jeu-simple",
    templateUrl: "./vue-jeu-simple.component.html",
    styleUrls: ["./vue-jeu-simple.component.css"],
})
export class VueJeuSimpleComponent implements OnInit {
   
    @ViewChild("errorClick")
    public errorClick: ElementRef;
    @ViewChild("clickZone")
    public clickZone: ElementRef;
    

    public currentMode: currentMode ;
    public pointFound: number[][];
    public scrHeight: number;
    public scrWidth: number;
    public nbDiff: number;
    public nbDiffPlayer2: number;
    public game: Game2D = {
        id: Guid.create().toString(),
        parentID: "",
        type: 1,
        name: "defaultSelectedGame",
        image: "../../assets/imagesBMP/image2_1.bmp",
        modifiedImage: "../../assets/imagesBMP/image1_2.bmp",
        differencesImage: "a modifier",
        bestTimeSolo: [[], [], []],
        bestTime1v1: [[], [], []],
    };
    public minutes: string;
    public seconds: string;
    public timeStart: number;
    public minAtStart: number;
    public secAtStart: number;
    public canClick: boolean = true;
    public succesAudioservice: AudioPlayerService;
    public errorAudioservice: AudioPlayerService;
    public vueJeuSimpleService: VueJeuSimpleService;
    public gameNameTampon: string;

    public constructor(public http: HttpClient,
                       public router: Router,
                       public messageService: MessageService,
                       public authService: AuthService,
                       public socketService: WebSocketService,
                       public errorIdentfication: ErrorIdentificationService ) {
        this.http.get("http://localhost:3000/getSelectedGame").subscribe((game: Game2D) => {
            this.game = game;
            this.http.post<Game2D>("http://localhost:3000/resetGetDiffService", this.game).subscribe((game: Game2D) => {
                this.game = game;
                this.gameNameTampon = this.game.modifiedImage;
                this.game.modifiedImage = this.gameNameTampon + "?" + new Date().getTime();
            });
        });
        this.succesAudioservice = new AudioPlayerService;
        this.errorAudioservice = new AudioPlayerService("assets/wrong.mp3");
        this.minutes = this.seconds = "00";
        this.timeStart = Date.now();
        this.nbDiff = 0;
        this.nbDiffPlayer2 = 0;
        //this.vueJeuSimpleService = new VueJeuSimpleService();
        this.getScreenSize();
        this.pointFound = new Array();
    }

    public ngOnInit(): void {
        this.timeStart = Date.now();
        void this.delay(HALF_SECOND);
        this.minutes = this.seconds = "00";
        this.getScreenSize();
        // TODO: set by default to modeSolo for now , but we have to update it!
        this.currentMode = currentMode.modeSolo;
    }

    @HostListener("window:resize", ["$event"])
    public getScreenSize(): void {
          this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
    }

    public async delay(ms: number): Promise<void> {
        await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() => {
            const time: number = Date.now();
            const delta: number = time - this.timeStart;
            this.minutes = this.displayNumber(Math.floor((delta % (SECOND * MINUTE * HOUR)) / (SECOND * MINUTE)));
            this.seconds = this.displayNumber(Math.floor((delta % (SECOND * MINUTE)) / SECOND));
            void this.delay(HALF_SECOND);
        });
    }

    public displayNumber(n: number): string {

        if (n < TEN) {
            return "0" + n;
        } else {
            return n.toString();
        }
    }

    public clickImage(event: MouseEvent): void {
        if (event && this.canClick) {
        const nbDiff: number = this.pointFound.length;
            const pos: number[] = this.convertPosition(event.offsetX, event.offsetY);
            this.http.post("http://localhost:3000/clickedPixel",
                           {"positionX" : pos[0],
                            "positionY" : pos[1],
                            "game" : this.game,
                            "pointFound" : this.pointFound},
            ).subscribe((pointFound: number[][]) => {
                this.pointFound = pointFound;
                if (nbDiff !== pointFound.length) {
                    this.game.modifiedImage = this.gameNameTampon + "?" + new Date().getTime();
                    this.succesAudioservice.playSong();
                    this.nbDiff++;
                    this.messageService.addDifferenceFoundMessage(new Date());
                    if (this.nbDiff === DIFFWANTED) {
                        this.endGame();
                    }
                } else {
                  this.messageService.addIdentificationErrorMessage(new Date());
                    this.canClick = false;
                    this.errorAudioservice.playSong();
                    this.errorIdentfication.moveError(event, this.errorClick);
                    this.errorIdentfication.showError(this.errorClick);
                    this.errorIdentfication.errorCursor(this.clickZone);
                    window.setTimeout(() => {this.canClick = true;},1000);
                }
            });
        }
    }

    public convertPosition(x: number, y: number): number[] {
        const imageWidthOriginal: number = 640;
        const imageHeightOriginal: number = 480;
        // tslint:disable-next-line:no-magic-numbers
        const imageWidthResized: number = 44 / 100;

        const imageWidthPixels: number = this.scrWidth * imageWidthResized;
        const imageHeightPixels: number = imageWidthPixels * imageHeightOriginal / imageWidthOriginal;
        let newX: number = Math.floor(x * imageWidthOriginal / imageWidthPixels);
        let newY: number = Math.floor(y * imageHeightOriginal / imageHeightPixels);

        if (newX < 0) {
            newX = 0;
        }
        if (newX >= imageWidthOriginal) {
            newX = imageWidthOriginal - 1;
        }
        if (newY < 0) {
            newY = 0;
        }
        if (newY >= imageHeightOriginal) {
            newY = imageHeightOriginal - 1;
        }

        return [newX, newY];
    }

    public endGame(): void {
        const time: number = Number(this.minutes) * MINUTE + Number(this.seconds);
        this.vueJeuSimpleService.setScores(this.game, time);

        if (this.vueJeuSimpleService.isInTopThree()) {
                //  console.log("debug");
            const newRecordMsg: GameMessage = {
                date: new Date(),
                gameName: this.game.name,
                userNameAuthor: this.authService.userName,
                position: this.vueJeuSimpleService.getPosition(),
                numberOfPlayers: this.currentMode === currentMode.modeSolo ? "solo" : "un contre un"};

            this.socketService.emit<GameMessage>("newRecordBroadcastMsg", newRecordMsg);
        }

        this.http.post("http://localhost:3000/saveSelectedGame",
                       { "game": this.game, "time": time, "userName": this.authService.userName, "solo": true})
        .subscribe(() => {
            alert("BRAVO!");
            void this.router.navigate(["/", "game-modes"]);
        });
    }
}
