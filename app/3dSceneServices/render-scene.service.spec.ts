
import { TestBed } from "@angular/core/testing";

import { RenderSceneService } from "./render-scene.service";

describe("RenderSceneService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: RenderSceneService = TestBed.get(RenderSceneService);
    expect(service).toBeTruthy();
  });
});
