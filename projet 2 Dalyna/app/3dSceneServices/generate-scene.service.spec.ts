
import { TestBed } from "@angular/core/testing";
import { GenerateSceneService } from "./generate-scene.service";

import {
    platformBrowserDynamicTesting,
    BrowserDynamicTestingModule
} from "@angular/platform-browser-dynamic/testing";
import { Mesh, Object3D, Scene, Vector3 } from "three";
import { GenerateObjectService } from "./generate-object.service";

describe("GenerateSceneService", () => {
    let service: GenerateSceneService;
    let objGen: GenerateObjectService;

    beforeEach(() => {
        TestBed.resetTestEnvironment();
        TestBed.initTestEnvironment(BrowserDynamicTestingModule,
                                    platformBrowserDynamicTesting());
        objGen = new GenerateObjectService();
        service = new GenerateSceneService(objGen);
    });

    it("should be created", () => {
        service = TestBed.get(GenerateSceneService);
        expect(service).toBeTruthy();
    });

    describe("callRandomObjectGenerator()", () => {

        it("should return a Mesh", () => {
            service = TestBed.get(GenerateSceneService);
            const typeExpected: Mesh = new Mesh();
            expect(typeof service.callRandomObjectGenerator()).toEqual(typeof typeExpected);
        });
    });

    describe("adjustNewObjPositionVector()", () => {
        let mockObjNew: Object3D;
        let mockObjOld: Object3D;

        beforeEach(() => {
            mockObjNew = new Object3D();
            mockObjOld = new Object3D();
            service = TestBed.get(GenerateSceneService);
            objGen = TestBed.get(GenerateObjectService);
        });

        it("should displace new object away from the old by the right amount", () => {

            // tslint:disable-next-line:no-magic-numbers
            const positionVectorNew: Vector3 = new Vector3(10, 10, 10);
            // tslint:disable-next-line:no-magic-numbers
            positionVectorNew.addScalar(10);
            // tslint:disable-next-line:no-magic-numbers
            const expectedResult: Vector3 = new Vector3(20, 20, 20);
            service.adjustNewObjPositionVector(mockObjNew, mockObjOld);
            expect(positionVectorNew).toEqual(expectedResult);
        });

        it("should not displace new object below the xz plane", () => {
            service = TestBed.get(GenerateSceneService);
            mockObjNew.position.set(0, 0, 0);
            mockObjOld.position.set(0, 0, 0);
            service.adjustNewObjPositionVector(mockObjNew, mockObjOld);
            const expectedResult: number = objGen.MIN_Y_FROM_ORIGIN;
            service.adjustNewObjPositionVector(mockObjNew, mockObjOld);
            expect(mockObjNew.position.y).toBeGreaterThanOrEqual(expectedResult);
        });

        it("should not displace new object at the min distance from the old", () => {
            service = TestBed.get(GenerateSceneService);
            mockObjOld.position.set(0, 0, 0);
            mockObjNew.position.set(service.SPACING_REQUIRED, service.SPACING_REQUIRED, service.SPACING_REQUIRED);
            const expectedResult: Vector3 = mockObjNew.position;
            service.adjustNewObjPositionVector(mockObjNew, mockObjOld);
            expect(mockObjNew.position).toEqual(expectedResult);
        });
    });

    describe("generateRandomScene()", () => {

        it("should return a Scene", () => {
            service = TestBed.get(GenerateSceneService);
            const typeExpected: Scene = new Scene();
            expect(typeof service).toEqual(typeof typeExpected);
        });

        it("should throw an error if number of objects is 9 (< 10)", () => {
            service = TestBed.get(GenerateSceneService);
            const belowIntervalValue: number = 9;
            const sceneGeneratorFunc: () => void =  () => {
                 service.generateRandomScene(belowIntervalValue);
            };
            expect(sceneGeneratorFunc).toThrowError(RangeError, "The number of objects must be between 10 and 200.");
        });

        it("should throw an error if number of objects is 201 (> 200)", () => {
            service = TestBed.get(GenerateSceneService);
            const aboveIntervalValue: number = 201;
            const sceneGeneratorFunc: () => void = () => {
                service.generateRandomScene(aboveIntervalValue);
            };
            expect(sceneGeneratorFunc).toThrowError(RangeError, "The number of objects must be between 10 and 200.");
        });

        it("should generate the right number of objects", () => {
            let mockScene: Scene = new Scene();
            const RESERVED_INDEXES: number = 3;
            service = TestBed.get(GenerateSceneService);
            const numberofObjectsExpected: number = 12;
            // tslint:disable-next-line:no-magic-numbers
            mockScene = service.generateRandomScene(12);
            expect(mockScene.children.length).toEqual(numberofObjectsExpected + RESERVED_INDEXES);
        });
    });

});
