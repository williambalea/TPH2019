import { Injectable } from "@angular/core";
import { Mesh, MeshStandardMaterial, Object3D, Scene } from "three";
import { GenerateObjectService } from "./generate-object.service";
import { GenerateSceneService } from "./generate-scene.service";

@Injectable({
  providedIn: "root",
})
export class ModifySceneService {

  public readonly RESERVED_INDEXES: number = 3;
  public readonly NB_OF_MODS: number = 7;
  public readonly CAN_ADD_INDEX: number = 0;
  public readonly CAN_REMOVE_INDEX: number = 0;
  public readonly CAN_MODIFY_INDEX: number = 0;

  public constructor( public objGen: GenerateObjectService,
                      public sceneGen: GenerateSceneService, ) { }

  public countNumberOf3dObjs( scene: Scene ): number {
    let nbOfObjs: number = 0;
    for ( const child of scene.children) {
      if ( child.isObject3D ) {
        nbOfObjs++;
      }
    }

    return nbOfObjs - this.RESERVED_INDEXES;
  }

  public addObject( scene: Scene, objArray: Object3D[] ): void {
    const newObj: Mesh = this.sceneGen.callRandomObjectGenerator();
    for ( const child of scene.children ) {
      if ( child.isObject3D ) {
        this.sceneGen.adjustNewObjPositionVector( newObj, child );
      }
    }
    objArray.push( newObj );
    scene.add( newObj );
  }

  public removeObject( scene: Scene, objArray: Object3D[] ): void {

    const nbOfObjs: number = this.countNumberOf3dObjs( scene );
    const startingIndex: number = this.RESERVED_INDEXES;
    const randomIndex: number = Math.round( Math.random() * ( nbOfObjs - 1 ) ) + startingIndex;

    if (!objArray.includes(scene.children[randomIndex], this.RESERVED_INDEXES)) {
      objArray.push(scene.children[randomIndex]);
      scene.children[randomIndex].visible = false;
    } else {
      this.removeObject( scene, objArray );
    }

  }

  public modifyObjectColor(scene: Scene, objArray: Object3D[]): void {

    const nbOfObjs: number = this.countNumberOf3dObjs(scene);
    const startingIndex: number = this.RESERVED_INDEXES;
    const randomIndex: number = Math.round( Math.random() * ( nbOfObjs - 1 ) ) + startingIndex;

    const modifiedObj: Mesh = scene.children[randomIndex] as Mesh;

    if (!objArray.includes(scene.children[randomIndex], this.RESERVED_INDEXES)) {
      modifiedObj.material = new MeshStandardMaterial({
        color: this.objGen.randomHexColor(),
        transparent: true,
        opacity: 1,
      });
      objArray.push(modifiedObj);
    } else {
      this.modifyObjectColor( scene, objArray );
    }

  }

  public modifyRandomObjects(scene: Scene, conditions: boolean[]): void {
    const objArray: Object3D[] = [];
    const canAdd: boolean = conditions[this.CAN_ADD_INDEX];
    const canRemove: boolean = conditions[this.CAN_REMOVE_INDEX];
    // tslint:disable-next-line:no-magic-numbers
    const canChangeColor: boolean = conditions[this.CAN_MODIFY_INDEX];

    if (canAdd && canRemove && canChangeColor) {
      this.addRemoveOrModifyObject(scene, objArray);
    } else if (canAdd && canRemove) {
      this.addOrRemoveObject(scene, objArray);
    } else if (canAdd && canChangeColor) {
      this.addOrModifyObject(scene, objArray);
    } else if (canRemove && canChangeColor) {
      this.removeOrModifyObject(scene, objArray);
    } else if (canAdd) {
      for (let i: number = 0 ; i < this.NB_OF_MODS ; i++) {
        this.addObject(scene, objArray);
      }
    } else if (canRemove) {
      for (let i: number = 0 ; i < this.NB_OF_MODS ; i++) {
        this.removeObject(scene, objArray);
      }
    } else if (canChangeColor) {
      for (let i: number = 0 ; i < this.NB_OF_MODS ; i++) {
        this.modifyObjectColor(scene, objArray);
      }
    }
  }

  public addRemoveOrModifyObject(scene: Scene, objArray: Object3D[] ): void {
    for (let i: number = 0 ; i < this.NB_OF_MODS ; i++) {
      const numberOfFunctions: number = 3;
      // tslint:disable-next-line:no-magic-numbers
      const randomIndex: number = Math.round( Math.random() * 100 * numberOfFunctions ) % numberOfFunctions;
      switch (randomIndex) {
      case 0: this.addObject(scene, objArray);
              break;
      case 1: this.removeObject(scene, objArray);
              break;
      // tslint:disable-next-line:no-magic-numbers
      case 2: this.modifyObjectColor(scene, objArray);
              break;
      default:
      }
    }
  }

  public addOrRemoveObject(scene: Scene, objArray: Object3D[] ): void {
    for (let i: number = 0 ; i < this.NB_OF_MODS ; i++) {
      const numberOfFunctions: number = 2;
      // tslint:disable-next-line:no-magic-numbers
      const randomIndex: number = Math.round( Math.random() * 100 * numberOfFunctions ) % numberOfFunctions;
      switch (randomIndex) {
      case 0: this.addObject(scene, objArray);
              break;
      case 1: this.removeObject(scene, objArray);
              break;
      default:
      }
    }
  }

  public addOrModifyObject(scene: Scene, objArray: Object3D[] ): void {
    for (let i: number = 0 ; i < this.NB_OF_MODS ; i++) {
      const numberOfFunctions: number = 2;
      // tslint:disable-next-line:no-magic-numbers
      const randomIndex: number = Math.round( Math.random() * 100 * numberOfFunctions ) % numberOfFunctions;
      switch (randomIndex) {
      case 0: this.addObject(scene, objArray);
              break;
      case 1: this.modifyObjectColor(scene, objArray);
              break;
      default:
      }
    }
  }

  public removeOrModifyObject(scene: Scene, objArray: Object3D[]): void {
    for (let i: number = 0 ; i < this.NB_OF_MODS ; i++) {
      const numberOfFunctions: number = 2;
      // tslint:disable-next-line:no-magic-numbers
      const randomIndex: number = Math.round( Math.random() * 100 * numberOfFunctions ) % numberOfFunctions;
      switch (randomIndex) {
      case 0: this.removeObject(scene, objArray);
              break;
      case 1: this.modifyObjectColor(scene, objArray);
              break;
      default:
      }
    }

  }

}
