import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root",
})
export class GenerateObjectService {

  public readonly REF_SIZE: number = 50;
  public readonly MIN_SCALE: number = 0.5;
  public readonly MAX_SCALE: number = 1.5;
  public readonly COLOR_DECIMAL_LIMIT: number = 16777215;
  public readonly MIN_X_FROM_ORIGIN: number = -800;
  public readonly MAX_X_FROM_ORIGIN: number = 800;
  public readonly MIN_Y_FROM_ORIGIN: number = 25;
  public readonly MAX_Y_FROM_ORIGIN: number = 800;
  public readonly MIN_Z_FROM_ORIGIN: number = -800;
  public readonly MAX_Z_FROM_ORIGIN: number = 800;
  public readonly NB_OF_SEGMENTS: number = 20;
  public readonly MAX_DEGREES: number = 360;
  public readonly HALF_MAX_DEGREES: number = 180;
  public readonly DEGREES_TO_RADIANS: number = Math.PI / this.HALF_MAX_DEGREES;

  public randomIntInRange( int1: number, int2: number ): number {
    return int1 + Math.round( Math.random() * ( int2 - int1 ) );
  }

  public randomHexColor(): number {
    const radix: number = 16;

    return parseInt( "0x" + Math.floor( Math.random() * this.COLOR_DECIMAL_LIMIT ).toString(radix), radix);
  }

  public randomRotation( obj: THREE.Mesh ): THREE.Mesh {
    obj.rotateX( this.randomIntInRange( 0, this.MAX_DEGREES ) * this.DEGREES_TO_RADIANS );
    obj.rotateY( this.randomIntInRange( 0, this.MAX_DEGREES ) * this.DEGREES_TO_RADIANS );
    obj.rotateZ( this.randomIntInRange( 0, this.MAX_DEGREES ) * this.DEGREES_TO_RADIANS );

    return obj;
  }

  public randomPosition( obj: THREE.Mesh ): THREE.Mesh {
    obj.position.x = this.randomIntInRange( this.MIN_X_FROM_ORIGIN, this.MAX_X_FROM_ORIGIN );
    obj.position.y = this.randomIntInRange( this.MIN_Y_FROM_ORIGIN, this.MAX_Y_FROM_ORIGIN );
    obj.position.z = this.randomIntInRange( this.MIN_Z_FROM_ORIGIN, this.MAX_Z_FROM_ORIGIN );

    return obj;
  }

  public generateRandomCube(): THREE.Mesh {
    const cubeSize: number =  this.randomIntInRange( this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE );
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial( {
      color: this.randomHexColor(),
      transparent: true,
      opacity: 1,
    });

    const cube: THREE.Mesh = new THREE.Mesh( geometry, material );
    this.randomRotation( cube );
    this.randomPosition( cube );

    return cube;
  }

  public generateRandomSphere(): THREE.Mesh {
    const radius: number = this.randomIntInRange( this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE );
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry( radius, this.NB_OF_SEGMENTS, this.NB_OF_SEGMENTS );

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial( {
      color: this.randomHexColor(),
      transparent: true,
      opacity: 1,
    });
    const sphere: THREE.Mesh = new THREE.Mesh( geometry, material );
    this.randomPosition( sphere );

    return sphere;
  }

  public generateRandomCylinder(): THREE.Mesh {
    const radius: number = this.randomIntInRange( this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE );
    const height: number = this.randomIntInRange( this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE );
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry( radius, radius, height, this.NB_OF_SEGMENTS, this.NB_OF_SEGMENTS );

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial( {
      color: this.randomHexColor(),
      transparent: true,
      opacity: 1,
    });
    const cylinder: THREE.Mesh = new THREE.Mesh( geometry, material );
    this.randomPosition( cylinder );

    return cylinder;
  }

  public generateRandomCone(): THREE.Mesh {
    const radius: number = this.randomIntInRange( this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE );
    const height: number = this.randomIntInRange( this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE );
    const geometry: THREE.ConeGeometry = new THREE.ConeGeometry( radius, height, this.NB_OF_SEGMENTS, this.NB_OF_SEGMENTS );

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial( {
      color: this.randomHexColor(),
      transparent: true,
      opacity: 1,
    });
    const cone: THREE.Mesh = new THREE.Mesh( geometry, material );
    this.randomPosition(cone);

    return cone;
  }

  public generateRandomPyramid(): THREE.Mesh {
    const radius: number = this.randomIntInRange(this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE);
    const height: number = this.randomIntInRange(this.REF_SIZE * this.MIN_SCALE, this.REF_SIZE * this.MAX_SCALE);
    const heightEdges: number = 4;
    const radiusTop: number = 1;
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry( radiusTop, radius, height, heightEdges );

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial( {
      color: this.randomHexColor(),
      transparent: true,
      opacity: 1,
    });
    const pyramid: THREE.Mesh = new THREE.Mesh( geometry, material );
    this.randomPosition(pyramid);

    return pyramid;
  }

  public generateFloor(): THREE.Mesh {
    const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial( {
      color: 0xD6D6D6,
      transparent: true,
      opacity: 1,
    });

    const widthAndHeightPlaneGeometry: number = 10000;
    const widthAndHeightSegments: number = 100;
    const geometryPlane: THREE.PlaneGeometry = new THREE.PlaneGeometry(
      widthAndHeightPlaneGeometry,
      widthAndHeightPlaneGeometry,
      widthAndHeightSegments,
      widthAndHeightSegments,
      );
    const meshPlane: THREE.Mesh = new THREE.Mesh( geometryPlane, material );
    const rotationFactorX: number = -90;
    meshPlane.rotation.x = this.DEGREES_TO_RADIANS * rotationFactorX;
    meshPlane.position.y = -this.REF_SIZE;

    return meshPlane;
  }
}
