import { Component, HostListener } from "@angular/core";
import { AuthService } from "./user/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent  {

    protected readonly title: string = "Jeu des 7 différences";

    public constructor(private authService: AuthService) {
    }

    @HostListener("window:beforeunload" , ["$event"])
    public beforeunloadHandler($event: Event): void {
          void this.authService.deleteUser();
    }

}
