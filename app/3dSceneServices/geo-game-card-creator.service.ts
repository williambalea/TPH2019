import { Injectable } from "@angular/core";
import { Guid } from "guid-typescript";
import { Game3DGeo } from "../../../../common/game3DGeo";
import { Scenes3D } from "../../../../server/app/scene3D";
import { GenerateSceneService } from "./generate-scene.service";
import { ModifySceneService } from "./modify-scene.service";
import { RenderSceneService } from "./render-scene.service";

@Injectable({
    providedIn: "root",
})
export class GeoGameCardCreatorService {

    public readonly CAN_ADD_OBJ: number = 0;
    public readonly CAN_DELETE_OBJ: number = 1;
    public readonly CAN_MODIFY_OBJ: number = 2;

    public constructor(
        public sceneGenerator: GenerateSceneService,
        public sceneRenderer: RenderSceneService,
        public sceneModifier: ModifySceneService,
    ) {

    }

    public createGame3DGeoCard(gameName: string, nbObjs: number, conditions: boolean[]): Game3DGeo {

        const newGame3DGeo: Game3DGeo = {
            id: Guid.create().toString(),
            parentID: "",
            type: 2,
            name: gameName,
            bestTimeSolo: [[], [], []],
            bestTime1v1: [[], [], []],
            gameScenes: this.createNewScenes(nbObjs),
            canAdd: conditions[this.CAN_ADD_OBJ],
            canDelete: conditions[this.CAN_DELETE_OBJ],
            canModifyColor: conditions[this.CAN_MODIFY_OBJ],
            numberOfObjects: nbObjs,
            image: "",
        };

        newGame3DGeo.image = this.sceneRenderer.generateStillImage(newGame3DGeo.gameScenes.originalScene);
        this.sceneModifier.modifyRandomObjects(newGame3DGeo.gameScenes.modifiedScene, conditions);

        return newGame3DGeo;
    }

    private createNewScenes(n: number): Scenes3D {
        const originalScene: THREE.Scene = this.sceneGenerator.generateRandomScene(n);
        const modifiedScene: THREE.Scene = originalScene.clone();

        return {
            originalScene: originalScene,
            modifiedScene: modifiedScene,
        };
    }
}
