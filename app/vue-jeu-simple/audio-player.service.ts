import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AudioPlayerService {

    public source: AudioBufferSourceNode ;
    private loadComplete: boolean ;
    private readonly context: AudioContext ;
    private buffer: AudioBuffer ;
    private xhr: XMLHttpRequest ;

    public constructor(public soundFile: string = "assets/plucky.mp3") {
         try {
            this.context = new AudioContext() ;
        } catch (error) {
            alert("no audio");
        }
         this.xhr = new XMLHttpRequest();
         this.loadFile();
    }

    public playSong(): void {
        if (this.context === undefined) {
            return;
        }

        if (!this.loadComplete) {
            return;
        }

        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);
        this.source.start(0);
    }

    private loadFile = () => {
        if ( this.context !== undefined ) {
            this.xhr.open("GET", this.soundFile, true);
            this.xhr.responseType = "arraybuffer";
            this.xhr.onload = this.onLoadComplete ;
            this.xhr.send();
        }
    }

    private decodeData = (buffer: AudioBuffer ): void => {
        this.buffer = buffer ;
        this.loadComplete = true ;
    }

    private onLoadComplete = (event: Event): void => {
        this.xhr = event.currentTarget as XMLHttpRequest;
        void this.context.decodeAudioData(this.xhr.response, this.decodeData) ;
    }
}
