
import { TestBed } from "@angular/core/testing";

import { GeoGameCardCreatorService } from "./geo-game-card-creator.service";

describe("GeoGameCardCreatorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GeoGameCardCreatorService = TestBed.get(GeoGameCardCreatorService);
    expect(service).toBeTruthy();
  });
});
