import { CommonModule } from "@angular/common";
import {Injectable, NgModule} from "@angular/core";
import {NavigationEnd, Router, RouterModule, Routes} from "@angular/router";
import { AdminTopMenuComponent } from "./admin-top-menu/admin-top-menu.component";
import { GameModesComponent } from "./game-modes/game-modes.component";
import { Geometric3dSceneComponent } from "./geometric3d-scene/geometric3d-scene.component";
import { SvCreationPopupComponent } from "./sv-creation-popup/sv-creation-popup.component";
import { AuthService } from "./user/auth.service";
import { UserComponent } from "./user/user.component";
import { VueJeuSimpleComponent } from "./vue-jeu-simple/vue-jeu-simple.component";
import { WaitingRoomComponent } from "./waiting-room/waiting-room.component"

import { MessagesComponent } from "./messages/messages.component";

const routes: Routes = [
  { path: "", component: UserComponent },
  { path: "test", component: SvCreationPopupComponent },
  { path: "admin", component: AdminTopMenuComponent},
  { path: "game-modes", component: GameModesComponent},
  { path: "scene3d", component: Geometric3dSceneComponent },
  { path: "vueJeuSimple", component: VueJeuSimpleComponent},
  { path: "vueJeuSimpleDuo", component: WaitingRoomComponent},
  { path: "chat", component: MessagesComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})

@Injectable()
export class AppRoutingModule {

  public constructor(private authService: AuthService,
                     private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.authService.isAuthenticated && event.url !== "/admin") {
          void this.router.navigate(["/"]);
        }
      }
    });

  }

}
