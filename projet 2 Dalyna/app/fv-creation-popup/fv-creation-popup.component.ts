import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { Message } from "../../../../common/communication/message";
import { Game3DGeo } from "../../../../common/game3DGeo";
import { Data } from "../../../../server/app/data";
import { GenerateSceneService } from "../3dSceneServices/generate-scene.service";
import { GeoGameCardCreatorService } from "../3dSceneServices/geo-game-card-creator.service";
import { ModifySceneService } from "../3dSceneServices/modify-scene.service";
import { RenderSceneService } from "../3dSceneServices/render-scene.service";

const MIN_LENGTH: number = 4;
const MAX_LENGTH: number = 25;
const MINOBJECT: number = 10;
const MAXOBJECT: number = 200;
const NUMBERPATTERN: string = "[0-9]*";

@Component({
  selector: "app-fv-creation-popup",
  templateUrl: "./fv-creation-popup.component.html",
  styleUrls: ["./fv-creation-popup.component.css"],
})

export class FvCreationPopupComponent implements OnInit {

  public gameName: string;
  public gameTypeSelected: string;
  public numberOfObjects: number;
  public canAdd: boolean;
  public canDelete: boolean;
  public canModifyColor: boolean;
  public constructor(
    public dialogRef: MatDialogRef<FvCreationPopupComponent>,
    public geoGameCardCreator: GeoGameCardCreatorService,
    public http: HttpClient,
    public sceneGenerator: GenerateSceneService,
    public sceneModifier: ModifySceneService,
    public sceneRenderer: RenderSceneService,
    public router: Router,
     ) {
      this.gameName = "DefaultName-3dScene";
      this.gameTypeSelected = "";
      this.numberOfObjects = 0;
      this.canAdd = false;
      this.canDelete = false;
      this.canModifyColor = false;
    }

  protected validationMessages: {
    "gameName": {type: string; message: string; } [],
    "quantity": {type: string; message: string; } [],
    "gameType": {type: string; message: string; } [],
    "modificationType": {type: string; message: string; } [],
  } = {
      "gameName" : [
        { type: "required", message: "Le nom du jeu est requis" },
        { type: "minlength", message: "Le nom du jeu doit avoir au minimum 4 mots" },
        { type: "maxlength", message: "Le nom du jeu doit avoir au maximum 25 mots" },
      ],
      "quantity" : [
        { type: "required", message: "Le quantité d'objet est requis" },
        { type: "min", message: "La quantité d'objet minimum est 10" },
        { type: "max", message: "La quantité d'objet maximum est 200" },
        { type: "pattern", message: "Seulement les valeurs numériques sont acceptées" },
      ],
      "gameType" : [
        { type: "required", message: "Le type d'objet est requis" },
      ],
      "modificationType" : [
        { type: "required", message: "Le type de modification est requis" },
      ],
    };
  protected enableTypes: boolean;
  protected requiredForm: FormGroup;
  public objectType: Object[] = [
    { id: 1, name: "Formes géométriques"},
    { id: 2, name: "Thématique"},
  ];
  public objectTypeSelected: string = "";
  public modificationType: Object[] = [
    { id: 1, name: "Ajout"},
    { id: 2, name: "Supression"},
    { id: 3, name: "Modification"},
  ];

  protected enable: boolean;
  public ngOnInit(): void {
    this.enable = false;
    this.requiredForm = new FormGroup({
        gameName: new FormControl ("", Validators.compose([
            Validators.maxLength(MAX_LENGTH),
            Validators.minLength(MIN_LENGTH),
            Validators.required,
          ])),
        quantity: new FormControl ("", Validators.compose([
            Validators.required,
            Validators.max(MAXOBJECT),
            Validators.min(MINOBJECT),
            Validators.pattern(NUMBERPATTERN),
          ])),
        objectType: new FormControl ("", Validators.compose([
          Validators.required,
          ])),
        modificationType: new FormControl ("", Validators.compose([
        Validators.required,
          ])),
    });
  }

  public checkButton(): void {
      this.enable =  this.requiredForm.valid;
  }

  public submit(event: MouseEvent): void {
      if (this.gameTypeSelected === "Formes géométriques") {

        const conditions: boolean[] = [this.canAdd, this.canDelete, this.canModifyColor];
        const newGeoCard: Game3DGeo = this.geoGameCardCreator.createGame3DGeoCard(this.gameName, this.numberOfObjects, conditions);

        Data.selectedGame = newGeoCard;
        alert("Test");
        this.http.post<Message>("http://localhost:3000/addGame3D", {
          "gameName": this.gameName,
          "nbObjects": newGeoCard.numberOfObjects,
          "stillImage": newGeoCard.image,
          "originalScene": newGeoCard.gameScenes.originalScene,
          "modifiedScene": newGeoCard.gameScenes.modifiedScene,
          "canAdd": newGeoCard.canAdd,
          "canDelete": newGeoCard.canDelete,
          "canModifyColor": newGeoCard.canModifyColor,
        }).subscribe( () => {
            this.close(event);
           // tslint:disable-next-line:no-floating-promises
            this.router.navigate(["/", "scene3d"]);
        });

      } else {
        alert("Vous devez selectionner 'Formes Geometriques.'\nL'option 'Thematique' n'est pas implementee.'");
      }
  }

  public close(event: MouseEvent): void {
    this.dialogRef.close();
  }

}
