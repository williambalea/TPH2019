import { Component, HostListener, OnInit } from "@angular/core";
import { PerspectiveCamera, Vector3 } from "three";
import { Game3DGeo } from "../../../../common/game3DGeo";
import { Data } from "../../../../server/app/data";
import { GenerateSceneService } from "../3dSceneServices/generate-scene.service";
import { ModifySceneService } from "../3dSceneServices/modify-scene.service";
import { RenderSceneService } from "../3dSceneServices/render-scene.service";

@Component({
    selector: "app-geometric3d-scene",
    templateUrl: "./geometric3d-scene.component.html",
    styleUrls: ["./geometric3d-scene.component.css"],
})
export class Geometric3dSceneComponent implements OnInit {

    public readonly NB_OF_OBJS: number = 10;
    public readonly CAMERA_RESET_VALUE: number = 2500;

    public readonly FWD_KEY: number = 87;   // W
    public readonly RWD_KEY: number = 83;   // S
    public readonly LEFT_KEY: number = 65;  // A
    public readonly RIGHT_KEY: number = 68; // D
    public readonly RESET_KEY: number = 82; // R

    public cameraDirection: Vector3 = new Vector3();
    public readonly cameraMovementScalar: number = 35;

    public readonly upUnitVector: THREE.Vector3 = new Vector3(0, 1, 0).normalize();

    public camera: THREE.PerspectiveCamera;
    public originalSceneCanvas: HTMLCanvasElement;
    public modifiedSceneCanvas: HTMLCanvasElement;
    public stillImageCanvas: HTMLCanvasElement;
    public game3DGeo: Game3DGeo;

    public constructor(
        public sceneGenerator: GenerateSceneService,
        public sceneModifier: ModifySceneService,
        public sceneRenderer: RenderSceneService,
    ) {
        this.camera = this.sceneRenderer.camera;
    }

    public ngOnInit(): void {

        try {
                this.game3DGeo = Data.selectedGame as Game3DGeo;
                this.originalSceneCanvas = this.sceneRenderer.getCanvasById("canvas-originalScene");
                this.modifiedSceneCanvas = this.sceneRenderer.getCanvasById("canvas-modifiedScene");
                this.stillImageCanvas = this.sceneRenderer.getCanvasById("canvas-image");
                this.game3DGeo.image = this.sceneRenderer.generateStillImage(this.game3DGeo.gameScenes.originalScene);
                this.sceneRenderer.renderScene(this.game3DGeo.gameScenes.originalScene, this.camera, this.originalSceneCanvas);
                this.sceneRenderer.renderScene(this.game3DGeo.gameScenes.modifiedScene, this.camera, this.modifiedSceneCanvas);
                Data.selectedGame = this.game3DGeo;

        } catch (error) {
            throw(error);
        }

    }

    @HostListener("window:keydown", ["$event"])
    public keyEvent(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case this.FWD_KEY: {
                this.moveForward(this.camera);
                break;
            }
            case this.RWD_KEY: {
                this.moveBackwards(this.camera);
                break;
            }
            case this.LEFT_KEY: {
                this.moveRightOrLeft(this.LEFT_KEY, this.camera);
                break;
            }
            case this.RIGHT_KEY: {
                this.moveRightOrLeft(this.RIGHT_KEY, this.camera);
                break;
            }
            case this.RESET_KEY: {
                this.camera.position.set(0, this.CAMERA_RESET_VALUE, 0);
                break;
            }
            default: break;
        }
    }

    public moveForward(camera: PerspectiveCamera): void {
        camera.getWorldDirection(this.cameraDirection).normalize();
        camera.position.add(this.cameraDirection.multiplyScalar(this.cameraMovementScalar));
    }

    public moveBackwards(camera: PerspectiveCamera): void {
        camera.getWorldDirection(this.cameraDirection).normalize();
        camera.position.add(this.cameraDirection.multiplyScalar(this.cameraMovementScalar).negate());
    }

    public moveRightOrLeft(keyValue: number, camera: PerspectiveCamera): void {
        const currentUnitVector: Vector3 = new Vector3();
        const normalVector: Vector3 = new Vector3();
        camera.getWorldDirection(currentUnitVector).normalize();

        if (keyValue === this.LEFT_KEY) {
            normalVector.crossVectors(this.upUnitVector, currentUnitVector);
        } else if (keyValue === this.RIGHT_KEY) {
            normalVector.crossVectors(this.upUnitVector, currentUnitVector).negate();
        }
        camera.position.add(normalVector.multiplyScalar(this.cameraMovementScalar));
    }
}
