import { Injectable } from "@angular/core";
import { AmbientLight, Color, Mesh, Object3D, PointLight, Scene  } from "three";
import { GenerateObjectService } from "./generate-object.service";

@Injectable({
  providedIn: "root",
})
export class GenerateSceneService {

  public readonly OBJ_SPACING: number = 50;
  public readonly MAX_OBJ_SIZE: number = this.objectGenerator.REF_SIZE * this.objectGenerator.MAX_SCALE;
  // tslint:disable-next-line:no-magic-numbers
  public readonly SPACING_REQUIRED: number = this.MAX_OBJ_SIZE / 2 + this.OBJ_SPACING;
  public readonly RANDOM_INDEX_SCALE: number = 200;

  public constructor( private objectGenerator: GenerateObjectService ) { }

  public callRandomObjectGenerator(): Mesh {
    const numberOfFunctions: number = 5;
    const randomIndex: number = Math.round( Math.random() * this.RANDOM_INDEX_SCALE ) % numberOfFunctions;
    const functionArray: Mesh [] = [
      this.objectGenerator.generateRandomCube(),
      this.objectGenerator.generateRandomSphere() ,
      this.objectGenerator.generateRandomCylinder(),
      this.objectGenerator.generateRandomCone(),
      this.objectGenerator.generateRandomPyramid(),
  ];

    return functionArray[randomIndex];
  }

  public verifyObjYPos( newObj: Object3D ): void {
    if ( newObj.position.y < this.objectGenerator.MIN_Y_FROM_ORIGIN ) {
      newObj.position.y = this.objectGenerator.MIN_Y_FROM_ORIGIN;
    }
  }

  public adjustNewObjPositionVector( newObj: Object3D, obj: Object3D ): Object3D {
    const distanceBetweenObjects: number = Math.abs( obj.position.distanceTo( newObj.position ) );

    if ( distanceBetweenObjects < this.SPACING_REQUIRED ) {
        newObj.position.addScalar( this.SPACING_REQUIRED - distanceBetweenObjects );
        this.verifyObjYPos( newObj );
    }

    return newObj;
  }

  public generateRandomScene( numberOfObjects: number ): Scene {

    const MIN_NB_OBJ: number = 10;
    const MAX_NB_OBJ: number = 200;
    const BACKGROUND_COLOR: number = 0x8FBCD4;

    if ( numberOfObjects < MIN_NB_OBJ || numberOfObjects > MAX_NB_OBJ ) {
      throw new RangeError("The number of objects must be between 10 and 200.");
    }

    const scene: Scene = new Scene();
    scene.background = new Color( BACKGROUND_COLOR );

    // Floor and Lights. These need to be added before shapes as they have reserved indexes.
    scene.add( this.objectGenerator.generateFloor() );
    this.setLights(scene);

    // Generating random shapes
    for ( let i: number = 0 ; i < numberOfObjects ; i++ ) {
      const newObj: Mesh = this.callRandomObjectGenerator();
      for ( const child of scene.children ) {
        if ( child.isObject3D ) {
          this.adjustNewObjPositionVector( newObj, child );
        }
      }
      scene.add( newObj );
    }

    return scene;
  }

  private setLights(scene: Scene): void {
    const pointLightCoordY: number = 1000;
    const lightIntensity: number = 0.5;
    const lightColor: number = 0xFFFFFF;

    const light: AmbientLight = new AmbientLight( lightColor, lightIntensity );
    scene.add( light );

    const pointLight: PointLight = new PointLight( lightColor, lightIntensity );
    pointLight.position.set( 0, pointLightCoordY, 0 );
    scene.add( pointLight );
  }

}
