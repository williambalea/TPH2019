import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Object3D, ObjectLoader, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import * as THREE from "three-full";
import { MeshInfo, SceneInfo } from "../../../../common/Object3D";
import { MODELS_PATH, SCENE } from "../../../../common/ThematicConstants";
import { COL_XS_TEXT, CONTROLSMAPPING, GET_3D_GAMES_SPECIFIC, GET_SCENE_PATH, MESSAGE_BOX, MODIFIED_SCENE,
  MODIFIED_SCENE_ID, ORIGINAL_SCENE_ID, PARAGRAPH_HTML, REMOVE_PLAYER_PATH, SCENE_HEIGHT, SCENE_WIDTH, THREE_SECOND, TIME_UNIT, TWO,
  TWO_SECOND, WEBGL, X_, Y_, Z_, ZERO} from "../../../../common/constants";
import { IGame } from "../../../../common/interfaces/IGame";
import { ThreeDGames } from "../admin-view/form-three-d/ThreeDGames";
import { AuthService } from "../auth.service";
import { DataTransferingService } from "../data-transfering.service";
import { ThumbnailService } from "../game-selection/game-thumbnails/thumbnail.service";
import { GameService } from "../game-service/game.service";
import { TimerService } from "../timer/timer.service";
import { WebsocketService } from "../websocket.service";
import { DisplaySetup } from "./DisplaySetup";

@Component({
    selector: "app-free-game-view",
    templateUrl: "./free-game-view.component.html",
    styleUrls: ["./free-game-view.component.css"],
    providers: [DatePipe],
  })
export class FreeGameViewComponent implements OnInit, OnDestroy {
    private loadedModels: Object3D[] = [];
    private loadedModelPaths: string[] = [];
    private loader: ObjectLoader;
    private sceneInfo: SceneInfo;
    private modifSceneInfo: SceneInfo;
    private renderer: WebGLRenderer;
    private modifRenderer: WebGLRenderer;
    private scene: Scene;
    private modifScene: Scene;
    private view: PerspectiveCamera;
    private modifView: PerspectiveCamera;
    private control: THREE.OrbitControls;
    private modifControl: THREE.OrbitControls;
    private originalCanvasContext: WebGLRenderingContext;
    private originalImgCanvas: HTMLCanvasElement;
    @ViewChild(ORIGINAL_SCENE_ID) private originalImg: ElementRef;
    private modifiedCanvasContext: WebGLRenderingContext;
    private modifiedImgCanvas: HTMLCanvasElement;
    @ViewChild(MODIFIED_SCENE_ID) private modifiedImg: ElementRef;
    private timer: TimerService;

    public nbError: number;
    public currentGame: IGame;
    public messageSubscribtion: Subscription;
    public gameLoading: boolean;

    public constructor( private http: HttpClient, private displaySetup: DisplaySetup,
                        private auth: AuthService,
                        public route: ActivatedRoute, public thumbnailService: ThumbnailService,
                        public dataTransfer: DataTransferingService, public gameService: GameService,
                        private date: DatePipe, private io: WebsocketService) {
      this.nbError = 0;
      this.loader = new ObjectLoader();
    }

    private initializeCanvas(): void {
      this.originalImgCanvas = this.originalImg.nativeElement as HTMLCanvasElement;
      this.originalCanvasContext = this.originalImgCanvas.getContext(WEBGL) as WebGLRenderingContext;
      this.originalImgCanvas.width = SCENE_WIDTH;
      this.originalImgCanvas.height = SCENE_HEIGHT;
      this.modifiedImgCanvas = this.modifiedImg.nativeElement as HTMLCanvasElement;
      this.modifiedCanvasContext = this.modifiedImgCanvas.getContext(WEBGL) as WebGLRenderingContext;
      this.modifiedImgCanvas.width = SCENE_WIDTH;
      this.modifiedImgCanvas.height = SCENE_HEIGHT;

    }

    private initializeView(): void {
      this.renderer = new WebGLRenderer({
        canvas: this.originalImgCanvas,
        context: this.originalCanvasContext,
        depth: false,
      });
      this.renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT);

      this.modifRenderer = new WebGLRenderer({
        canvas: this.modifiedImgCanvas,
        context: this.modifiedCanvasContext,
        depth: false,
      });
      this.modifRenderer.setSize(SCENE_WIDTH, SCENE_HEIGHT);
      this.view = this.displaySetup.initView();
      this.modifView = this.displaySetup.initView();

      this.control = new THREE.OrbitControls(this.view);
      this.control.keys = CONTROLSMAPPING;
      this.control.update();

      this.modifControl = new THREE.OrbitControls(this.modifView);
      this.modifControl.keys = CONTROLSMAPPING;
      this.modifControl.update();

    }

    private getScene(): void {
      const PATH: string = GET_SCENE_PATH + this.currentGame._id;
      this.http.get<SceneInfo>(PATH).subscribe((sceneObjects) => this.sceneInfo = sceneObjects);
      const MODIFICATION_PATH: string = GET_SCENE_PATH + MODIFIED_SCENE + this.currentGame._id;
      this.http.get<SceneInfo>(MODIFICATION_PATH).subscribe((modifSceneObjects) => this.modifSceneInfo = modifSceneObjects);
      setTimeout(() => { this.setupScene(); }, THREE_SECOND);
    }

    private setupScene(): void {
      this.scene = this.displaySetup.initScene(this.sceneInfo);
      this.modifScene = this.displaySetup.initScene(this.modifSceneInfo);
      if (this.sceneInfo.thematic) {
        this.loadScene(MODELS_PATH + SCENE);
        for (const obj of this.sceneInfo.objects) {
            const id: number = this.loadedModelPaths.findIndex((element) => obj.model === element);
            if (id !== -1) {
              this.scene.add(this.loadedModels[id].clone());
            } else {
              this.loadModel(MODELS_PATH, obj);
            }
        }
        for (const obj of this.modifSceneInfo.objects) {

          if (!obj.isDeleted) {
            const id: number = this.loadedModelPaths.findIndex((element) => obj.model === element);
            if (id !== -1) {
              this.modifScene.add(this.loadedModels[id].clone());
            } else {
              this.loadModified(MODELS_PATH, obj);
            }
          }
        }
      }
      setTimeout(() => { this.gameLoading = false; this.gameLoop(); this.timer.startTimer(); }, TWO_SECOND);
    }

    public display(): void {
      this.renderer.clear(true, true, true);
      this.modifRenderer.clear(true, true, true);
      this.renderer.render(this.scene, this.view);
      this.modifRenderer.render(this.modifScene, this.modifView);
    }

    public gameLoop(): void {
      requestAnimationFrame(() => this.gameLoop());
      this.control.update();
      this.modifControl.update();
      this.display();
     }

    public addText(aMessage: string): void {
      const SCROLL: HTMLElement = document.getElementsByClassName(COL_XS_TEXT)[TWO] as HTMLElement;
      const TEXT_BOX: HTMLElement = document.getElementById(MESSAGE_BOX) as HTMLElement;
      const MESSAGE: HTMLElement = document.createElement(PARAGRAPH_HTML) as HTMLElement;
      const TIME: string = this.date.transform(new Date(), TIME_UNIT) as string;
      this.gameService.setColor(MESSAGE, aMessage);
      MESSAGE.innerText = TIME + aMessage;
      TEXT_BOX.appendChild(MESSAGE);
      this.gameService.verifAmountOfMessage(TEXT_BOX);
      SCROLL.scrollTop = SCROLL.scrollHeight;
    }

    public getCurrentGame(): Subscription {
      return this.http.get<ThreeDGames[]>(
        GET_3D_GAMES_SPECIFIC + this.route.snapshot.paramMap.get("id")).subscribe((game: ThreeDGames[]) => {
        this.currentGame = this.thumbnailService.convert3DgameToThumbnail(game[ZERO]);
        this.timer = new TimerService();
        this.getScene();
      });
    }

    public ngOnInit(): void {
      this.gameLoading = true;
      this.auth.ReloginOnPageRefresh();

      this.io.listen();

      this.initializeCanvas();
      this.initializeView();
      this.getCurrentGame();

      this.messageSubscribtion = this.dataTransfer.gameMessage.subscribe((message: string) => {
        this.addText(message);
      });

    }

    public ngOnDestroy(): void {
      this.messageSubscribtion.unsubscribe();
    }

    @HostListener("window:beforeunload", ["$event"])
    public beforeUnloadEvent($event: Event): void {
      this.io.disconnect();
      this.http.delete(REMOVE_PLAYER_PATH).subscribe();
    }

    private loadModel(path: string, obj: MeshInfo): void {
      this.loader.load(path + obj.model, (group: Object3D) => {
        group.scale.set(obj.scale[X_], obj.scale[Y_], obj.scale[Z_]);
        group.position.set(obj.pos[X_], obj.pos[Y_], obj.pos[Z_]);
        group.rotation.set(obj.rot[X_], obj.rot[Y_], obj.rot[Z_]);
        this.loadedModelPaths.push(obj.model);
        this.loadedModels.push(group.clone());
        this.scene.add(group.clone()); },
                       (err) => { throw err; });

      }
    private loadModified(path: string, obj: MeshInfo): void {
      this.loader.load(path + obj.model, (group) => {
        group.scale.set(obj.scale[X_], obj.scale[Y_], obj.scale[Z_]);
        group.position.set(obj.pos[X_], obj.pos[Y_], obj.pos[Z_]);
        group.rotation.set(obj.rot[X_], obj.rot[Y_], obj.rot[Z_]);
        this.loadedModelPaths.push(obj.model);
        this.loadedModels.push(group.clone());
        this.modifScene.add(group.clone()); },
                       (err) => { throw err; });

      }
    private loadScene(path: string): void {
        this.loader.load(path, (group) => {
          this.scene.add(group.clone());
          this.modifScene.add(group.clone()); },
                         (err) => { throw err; });
      }
    }
