import { ElementRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ErrorIdentificationService } from "./error-identification.service";

describe("ErrorIdentificationService", () => {

  beforeEach(() => {
        // spies
        void TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            providers: [],
        }).compileComponents();
    });

  it("should be created", () => {
      const service: ErrorIdentificationService = TestBed.get(ErrorIdentificationService);
      expect(service).toBeTruthy();
    });

  it("should move html div ref to click position on window", () => {
      const top: number = 600;
      const left: number = 550;
      const service: ErrorIdentificationService = TestBed.get(ErrorIdentificationService);
      const errorDiv: HTMLDivElement = document.createElement("div");
      const errorRef: ElementRef = new ElementRef(errorDiv);
      const mouseEvent: MouseEvent = document.createEvent("MouseEvent");
      mouseEvent.initMouseEvent("click", true, true , window, 0, 0, 0, left, top, false, false, false, false, 0, null);
      const offsetLeft: number =  (errorRef.nativeElement.clientWidth) * 0.5;
      const offsetTop: number =  (errorRef.nativeElement.clientHeight) * 0.5;
      const positionLeft: string = left - offsetLeft + "px";
      const positionTop: string = top - offsetTop + "px";
      service.moveError(mouseEvent, errorRef);
      expect(errorRef.nativeElement.style.left).toEqual(positionLeft);
      expect(errorRef.nativeElement.style.top).toEqual(positionTop);
    });

  it("should make div visible for 1000 milliseconds (1 second) and set it back to hidden", () => {
      const service: ErrorIdentificationService = TestBed.get(ErrorIdentificationService);
      const errorDiv: HTMLDivElement = document.createElement("div");
      const errorRef: ElementRef = new ElementRef(errorDiv);
      service.showError( errorRef);
      expect(errorRef.nativeElement.style.visibility ).toEqual("visible");
      window.setTimeout(() => {expect(errorRef.nativeElement.style.visibility).toEqual("hidden"); }, 1000);
    });
  it("should make cursor: not-allowed for 1000 milliseconds (1 second) and set it back to cursor: pointer", () => {
      const service: ErrorIdentificationService = TestBed.get(ErrorIdentificationService);
      const clickZoneDiv: HTMLDivElement = document.createElement("div");
      const clickZoneRef: ElementRef = new ElementRef(clickZoneDiv);
      service.errorCursor(clickZoneRef);
      expect(clickZoneRef.nativeElement.style.cursor).toEqual("not-allowed");
      window.setTimeout(() => {expect(clickZoneRef.nativeElement.style.cursor ).toEqual("pointer"); }, 1000);
    });
});
