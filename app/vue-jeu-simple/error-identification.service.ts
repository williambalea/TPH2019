import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})

export class ErrorIdentificationService {

  public timeVisible: number;

  public constructor() {
    this.timeVisible = 1000;
  }

  public moveError(event: MouseEvent, errorDivRef: ElementRef): void {
    const offsetLeft: number = (errorDivRef.nativeElement.clientWidth) * 0.5;
    const offsetTop: number = (errorDivRef.nativeElement.clientHeight) * 0.5;
    const positionLeft: string = event.pageX - offsetLeft + "px";
    const positionTop: string = event.pageY - offsetTop + "px";
    errorDivRef.nativeElement.style.left = positionLeft;
    errorDivRef.nativeElement.style.top = positionTop;
  }

  public showError(errorDivRef: ElementRef): void {
    errorDivRef.nativeElement.style.visibility = "visible";
    window.setTimeout(() => {errorDivRef.nativeElement.style.visibility = "hidden"; }, this.timeVisible);
  }

  public errorCursor(clickZone: ElementRef): void {
    clickZone.nativeElement.style.cursor = "not-allowed";
    window.setTimeout(() => {clickZone.nativeElement.style.cursor = "pointer"; }, this.timeVisible);
  }
}
