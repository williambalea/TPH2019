/*
import { TestBed } from "@angular/core/testing";
import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { AudioPlayerService } from "./audio-player.service";
// import Spy = jasmine.Spy;

describe("AudioService", () => {

    let service: AudioPlayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        TestBed.resetTestEnvironment();
        TestBed.initTestEnvironment(BrowserDynamicTestingModule,
                                    platformBrowserDynamicTesting());

    });

    it("should be created", () => {
        service = TestBed.get(AudioPlayerService);
        expect(service).toBeTruthy();
    });

    describe("#playSong", () => {
        it("should play song", (done: DoneFn) => {
            service = TestBed.get(AudioPlayerService);
            // let finished: boolean = false ;
            // const spy: Spy = spyOn(service, "playSong").and.returnValue(0);
            let hasBeenPlayed: boolean = false ;
            service.source.onended = () => {
                hasBeenPlayed = true;
                // finished = true;
                done();
            };
            service.playSong();
            const songDuration: number = 1900;
            setTimeout(() => expect(hasBeenPlayed).toBe(true), songDuration);
        });
    });
});
*/