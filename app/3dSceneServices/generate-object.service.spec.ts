
import { TestBed } from "@angular/core/testing";
import { platformBrowserDynamicTesting,
         BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import * as THREE from "three";
import { GenerateObjectService } from "./generate-object.service";

describe("GenerateObjectService", () => {
    let service: GenerateObjectService;

    beforeEach(() => {
        TestBed.resetTestEnvironment();
        TestBed.initTestEnvironment(BrowserDynamicTestingModule,
                                    platformBrowserDynamicTesting());
        service = new GenerateObjectService();
    });

    it("should be created", () => {
        service = TestBed.get(GenerateObjectService);
        expect(service).toBeTruthy();
    });

    describe("randomIntInRange() ", () => {

        it("should return a number", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: number = 0;
            expect(typeof service.randomIntInRange(0, 0)).toEqual(typeof typeExpected);
        });

        it("should return 0 if the range is between 0 and 0", () => {
            service = TestBed.get(GenerateObjectService);
            expect(service.randomIntInRange(0, 0)).toEqual(0);
        });

        it("should return a random number in the specified range", () => {
            service = TestBed.get(GenerateObjectService);
            const min: number = 0;
            const max: number = 100;
            expect(service.randomIntInRange(min, max)).toBeGreaterThanOrEqual(min);
            expect(service.randomIntInRange(min, max)).toBeLessThanOrEqual(max);
        });
    });

    describe("randomHexColor()", () => {

        it("should return a number", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: number = 0;
            expect(typeof service.randomHexColor()).toEqual(typeof typeExpected);
        });
    });

    describe("randomRotation()", () => {

        it("should return a Mesh", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: THREE.Mesh = new THREE.Mesh();
            const mockObj: THREE.Mesh = new THREE.Mesh();
            expect(typeof service.randomRotation(mockObj)).toEqual(typeof typeExpected);
        });
    });

    describe("generateRandomCube()", () => {

        it("should return a Cube", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: THREE.Mesh = new THREE.Mesh();
            const mockObj: THREE.Mesh = new THREE.Mesh();
            expect(typeof service.randomRotation(mockObj)).toEqual(typeof typeExpected);
        });
    });

    describe("generateRandomSphere()", () => {

        it("should return a Sphere", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: THREE.Mesh = new THREE.Mesh();
            const mockObj: THREE.Mesh = new THREE.Mesh();
            expect(typeof service.randomRotation(mockObj)).toEqual(typeof typeExpected);
        });
    });

    describe("generateRandomCone()", () => {

        it("should return a Cone", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: THREE.Mesh = new THREE.Mesh();
            const mockObj: THREE.Mesh = new THREE.Mesh();
            expect(typeof service.randomRotation(mockObj)).toEqual(typeof typeExpected);
        });
    });

    describe("generateRandomPyramid()", () => {

        it("should return a Pyramid", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: THREE.Mesh = new THREE.Mesh();
            const mockObj: THREE.Mesh = new THREE.Mesh();
            expect(typeof service.randomRotation(mockObj)).toEqual(typeof typeExpected);
        });
    });

    describe("generateFloor()", () => {

        it("should return a Plane", () => {
            service = TestBed.get(GenerateObjectService);
            const typeExpected: THREE.Mesh = new THREE.Mesh();
            const mockObj: THREE.Mesh = new THREE.Mesh();
            expect(typeof service.randomRotation(mockObj)).toEqual(typeof typeExpected);
        });
    });

});
