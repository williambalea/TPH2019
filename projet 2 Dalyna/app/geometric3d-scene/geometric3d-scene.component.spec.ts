
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PerspectiveCamera, Vector3 } from "three";
import { GenerateObjectService } from "../3dSceneServices/generate-object.service";
import { GenerateSceneService } from "../3dSceneServices/generate-scene.service";
import { Geometric3dSceneComponent } from "./geometric3d-scene.component";

//const FWD_KEY: number = 87;   // W
//const RWD_KEY: number = 83;   // S
const LEFT_KEY: number = 65;  // A
const RIGHT_KEY: number = 68; // D
//const RESET_KEY: number = 82; // R

describe("Geometric3dSceneComponent", () => {
    let component: Geometric3dSceneComponent;
    let fixture: ComponentFixture<Geometric3dSceneComponent>;

    beforeEach(async(() => {

        void TestBed.configureTestingModule({
        declarations: [ Geometric3dSceneComponent ],
        providers: [
            GenerateObjectService,
            GenerateSceneService,
        ],
        schemas: [ NO_ERRORS_SCHEMA ],

        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Geometric3dSceneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("after ngOnInit(), geo3DGame is defined.", () => {
        component.ngOnInit();
        expect( component.game3DGeo ).toBeDefined();
    });

    it("returns error if it catches an error", () => {
        // tslint:disable-next-line:no-magic-numbers
        expect( () => { component.sceneGenerator.generateRandomScene( 9 ); } )
        .toThrowError( RangeError, "The number of objects must be between 10 and 200." );
    });

    it("moveFoward() moves the camera to to right position in space.", () => {
        const FOV: number = 75;
        const MIN_CLIP: number = 0.1;
        const MAX_CLIP: number = 10000;
        const mockCamera: PerspectiveCamera = new PerspectiveCamera(
        FOV,
        window.innerWidth / window.innerHeight,
        MIN_CLIP,
        MAX_CLIP,
        );
        mockCamera.position.set(0, 0, 0);
        const expectedPosition: Vector3 = new Vector3(0, 0, -component.cameraMovementScalar);
        component.moveForward(mockCamera);

        expect( mockCamera.position ).toEqual( expectedPosition );
    });

    describe("move camera function", () => {
        const FOV: number = 75;
        const MIN_CLIP: number = 0.1;
        const MAX_CLIP: number = 10000;
        const mockCamera: PerspectiveCamera = new PerspectiveCamera(
            FOV,
            window.innerWidth / window.innerHeight,
            MIN_CLIP,
            MAX_CLIP,
        );
        it ("should mouve left", () => {
            mockCamera.position.set(0, 0, 0);
            const expectedPosition: Vector3 = new Vector3(-component.cameraMovementScalar, 0, 0);
            component.moveRightOrLeft(LEFT_KEY, mockCamera)
            expect(mockCamera.position).toEqual(expectedPosition);
        })

        it("should move right", () => {
            mockCamera.position.set(0, 0, 0);
            const expectedPosition: Vector3 = new Vector3(component.cameraMovementScalar, 0, 0);
            component.moveRightOrLeft(RIGHT_KEY, mockCamera);
            expect(mockCamera.position).toEqual(expectedPosition);
        })

        it("moveFoward() moves the camera to to right position in space.", () => {
            mockCamera.position.set(0, 0, 0);
            const expectedPosition: Vector3 = new Vector3(0, 0, -component.cameraMovementScalar);
            component.moveForward(mockCamera);
    
            expect( mockCamera.position ).toEqual( expectedPosition );
        });

        it("should move backward", () => {
            mockCamera.position.set(0, 0, 0);
            const expectedPosition: Vector3 = new Vector3(0, 0, component.cameraMovementScalar);
            component.moveBackwards(mockCamera);
            expect( mockCamera.position ).toEqual( expectedPosition );
        });

        /*
        it("resetKey should reset position", () => {
            mockCamera.position.set(1, 1, 1);
            const expectedPosition: Vector3 = new Vector3(0, 2500, 0);
            const event: KeyboardEvent = new KeyboardEvent("keydown", {"key": "KeyR"});
            component.keyEvent(event);
            expect(mockCamera.position).toEqual(expectedPosition)
        });
        */
    })
});
