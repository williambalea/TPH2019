// External
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // <-- NgModel lives here
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule,
  MatDividerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
// import { appRoutes } from "../../../server/app/routes";
// Internal
import { GenerateObjectService } from "./3dSceneServices/generate-object.service";
import { GenerateSceneService } from "./3dSceneServices/generate-scene.service";
import { ModifySceneService } from "./3dSceneServices/modify-scene.service";
import { RenderSceneService } from "./3dSceneServices/render-scene.service";
import { AdminTopMenuComponent } from "./admin-top-menu/admin-top-menu.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FvCreationPopupComponent } from "./fv-creation-popup/fv-creation-popup.component";
import { GameModesComponent } from "./game-modes/game-modes.component";
import { Geometric3dSceneComponent } from "./geometric3d-scene/geometric3d-scene.component";
import { SvCreationPopupComponent } from "./sv-creation-popup/sv-creation-popup.component";
import { AuthService } from "./user/auth.service";
import { UserComponent } from "./user/user.component";
import { VueJeuSimpleComponent } from "./vue-jeu-simple/vue-jeu-simple.component";
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';

import { MessagesComponent } from "./messages/messages.component";

import { MessageService } from "./messages/message.service";


@NgModule({
  declarations: [
    AppComponent,
    AdminTopMenuComponent,
    SvCreationPopupComponent,
    FvCreationPopupComponent,
    GameModesComponent,
    UserComponent,
    Geometric3dSceneComponent,
    VueJeuSimpleComponent,
    MessagesComponent,
    WaitingRoomComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: "never"}),
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    AppRoutingModule,
    RouterModule,
    MatInputModule,
  ],
  exports: [
    MatDividerModule,
    MatFormFieldModule,
  ],
  providers: [
    GenerateObjectService,
    GenerateSceneService,
    ModifySceneService,
    RenderSceneService,
    AuthService,
    MessageService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SvCreationPopupComponent,
    FvCreationPopupComponent,
  ],
})

export class AppModule {

}
