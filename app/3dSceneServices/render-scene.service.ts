import { Injectable } from "@angular/core";
import { Camera, PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
import { GenerateSceneService } from "./generate-scene.service";

@Injectable({
  providedIn: "root",
})
export class RenderSceneService {

  public readonly RENDER_RATIO_WIDTH: number = 0.48;
  public readonly RENDER_RATIO_HEIGHT: number = 0.6;

  public readonly FOV: number = 75;
  public readonly MIN_CLIP: number = 0.1;
  public readonly FAR_CLIP: number = 10000;

  public readonly camera: PerspectiveCamera;
  public readonly CAMERA_INIT_VALUE: number = 2500;

  public readonly CANVAS_WIDTH: number = 640;
  public readonly CANVAS_HEIGHT: number = 480;

  public constructor(public sceneGen: GenerateSceneService) {
    this.camera = new PerspectiveCamera(
    this.FOV,
    window.innerWidth / window.innerHeight,
    this.MIN_CLIP,
    this.FAR_CLIP,
    );
    this.camera.position.set(0, this.CAMERA_INIT_VALUE, 0);
  }

  public getCanvasById( canvasId: string ): HTMLCanvasElement {
    return document.getElementById( canvasId ) as HTMLCanvasElement;
  }

  public renderScene( scene: THREE.Scene, camera: THREE.Camera, canvasObj: HTMLCanvasElement ): void {
    const renderer: WebGLRenderer = new WebGLRenderer({
      canvas: canvasObj,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize( window.innerWidth * this.RENDER_RATIO_WIDTH, window.innerHeight * this.RENDER_RATIO_HEIGHT );

    const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);

    controls.update();
    camera.position.set( 0, this.CAMERA_INIT_VALUE, 0 );

    const animate: FrameRequestCallback = (): void => {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    };

    animate(1);
  }

  public generateStillImage( scene: THREE.Scene ): string {
    const camera: Camera = new PerspectiveCamera(
      this.FOV,
      window.innerWidth / window.innerHeight,
      this.MIN_CLIP,
      this.FAR_CLIP,
    );
    camera.position.set( 0, this.CAMERA_INIT_VALUE, 0 );
    camera.lookAt(0, 0, 0);

    const renderer: WebGLRenderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    renderer.setSize( this.CANVAS_WIDTH , this.CANVAS_HEIGHT );

    const animate: FrameRequestCallback = (): void => {
      renderer.render( scene, camera );
    };
    animate(0);

    return renderer.domElement.toDataURL("image/bmp");
  }

}
