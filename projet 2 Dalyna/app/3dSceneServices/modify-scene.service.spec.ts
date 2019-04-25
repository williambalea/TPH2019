
import { TestBed } from "@angular/core/testing";
import { Object3D, Scene } from "three";
import { GenerateSceneService } from "./generate-scene.service";
import { ModifySceneService } from "./modify-scene.service";

describe("ModifySceneService", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);

    expect(service).toBeTruthy();
  });
});

describe("countNumberOf3dObjs()", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should count the right number of objects", () => {
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    // tslint:disable-next-line:no-magic-numbers
    const mockScene: Scene = sceneGen.generateRandomScene(15);
    const RESERVED_INDEXES: number = 3;
    // tslint:disable-next-line:no-magic-numbers
    const expectedResult: number = RESERVED_INDEXES + 15;
    expect(mockScene.children.length).toEqual(expectedResult);
  });
});

describe("addObject()", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should add an object to a scene", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 15;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.addObject(mockScene, mockModifiedObjArray);
    const RESERVED_INDEXES: number = 3;
    const expectedResult: number = nbObjsInScene + RESERVED_INDEXES + 1;
    expect(mockScene.children.length).toEqual(expectedResult);
  });

  it("The object added is of type Object3D", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 15;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.addObject(mockScene, mockModifiedObjArray);
    const expectedType: Object3D = new Object3D();
    expect(typeof mockScene.children[ mockScene.children.length - 1]).toEqual(typeof expectedType);
  });

  it("The object added should be also added to the modifiedObjs Array", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 10;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);

    const mockModifiedObjArray: Object3D[] = [];
    service.addObject(mockScene, mockModifiedObjArray);

    expect(mockModifiedObjArray[0]).toBeDefined();
  });
});

describe("modifyObjectColor()", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should add the modified object to the modifiedObjsArray", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 10;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.modifyObjectColor(mockScene, mockModifiedObjArray);

    expect(mockModifiedObjArray[0]).toBeDefined();
  });
});

describe("modifyRandomObjects()", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should call addRemoveOrModifyObject()", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 10;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.addRemoveOrModifyObject(mockScene, mockModifiedObjArray);

    expect(mockModifiedObjArray[0]).toBeDefined();
  });

  it("should call addRemoveOrModifyObject() 7 times on different objects", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 10;
    const nbModif: number = 7;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.addRemoveOrModifyObject(mockScene, mockModifiedObjArray);
    expect(mockModifiedObjArray.length).toEqual(nbModif);
  });

  it("should call addOrRemoveObject() 7 times on different objects", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 10;
    const nbModif: number = 7;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.addOrRemoveObject(mockScene, mockModifiedObjArray);
    expect(mockModifiedObjArray.length).toEqual(nbModif);
  });

  it("should call addOrModifyObject() 7 times on different objects", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 10;
    const nbModif: number = 7;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.addOrModifyObject(mockScene, mockModifiedObjArray);
    expect(mockModifiedObjArray.length).toEqual(nbModif);
  });

  it("should call removeOrModifyObject() 7 times on different objects", () => {
    const service: ModifySceneService = TestBed.get(ModifySceneService);
    const sceneGen: GenerateSceneService = TestBed.get(GenerateSceneService);
    const nbObjsInScene: number = 10;
    const nbModif: number = 7;
    const mockScene: Scene = sceneGen.generateRandomScene(nbObjsInScene);
    const mockModifiedObjArray: Object3D[] = [];
    service.removeOrModifyObject(mockScene, mockModifiedObjArray);
    expect(mockModifiedObjArray.length).toEqual(nbModif);
  });

});
