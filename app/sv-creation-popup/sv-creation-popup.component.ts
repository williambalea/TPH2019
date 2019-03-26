import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Data, Router } from "@angular/router";

const MIN_LENGTH: number = 4;
const MAX_LENGTH: number = 25;
const EXTENSION: string = "[^ @]*.bmp";
const IMGHEIGHT: number = 480;
const IMGWIDTH: number = 640;
const ERRORWANTED: number = 7;

@Component({
  selector: "app-sv-creation-popup",
  templateUrl: "./sv-creation-popup.component.html",
  styleUrls: ["./sv-creation-popup.component.css"],
})
export class SvCreationPopupComponent implements OnInit {

    public constructor(

        public dialogRef: MatDialogRef<SvCreationPopupComponent>,
        public http: HttpClient,
        public router: Router,
        @Inject(MAT_DIALOG_DATA) public data: Data) {}
    public uploadUnchanged: boolean;
    public uploadChanged: boolean;
    public enableUnchanged: boolean;
    public enableChanged: boolean;
    public unchangedImgSize: number;
    public changedImgSize: number;
    public unchangedWidth: number;
    public unchangedHeight: number;
    public changedWidth: number;
    public changedHeight: number;
    public messageUpload: string = "";
    public formImages: FormData = new FormData;
    public unchangedImage: HTMLImageElement = new Image();
    public changedImage: HTMLImageElement = new Image();

    protected validationMessages: { "gameName": {type: string; message: string; } [],
                                    "unchangedImage": {type: string; message: string; } [],
                                    "changedImage": {type: string; message: string; } []; }  =  {
        "gameName" : [
        { type: "required", message: "Le nom du jeu est requis" },
        { type: "minlength", message: "Le nom du jeu doit avoir au minimum 4 mots" },
        { type: "maxlength", message: "Le nom du jeu doit avoir au maximum 25 mots" },
        ],
        "unchangedImage" : [
        { type: "required", message: "L'image originale est requise" },
        { type: "pattern", message: "Assurez vous que l'extension de l'image est .bmp" },
        ],
        "changedImage" : [
        { type: "required", message: "L'image modifiée est requise" },
        { type: "pattern", message: "Assurez vous que l'extension de l'image est .bmp" },
    ]};

    protected requiredForm: FormGroup ;
    protected enable: boolean;

    public nameInput: HTMLInputElement;
    public name: string;
    public unchangedFile: HTMLInputElement;
    public originalFile: File;

    public changedFile: HTMLInputElement;
    public modifiedFile: File;

    public ngOnInit(): void {
        this.enable = false;
        this.requiredForm = new FormGroup({
            gameName: new FormControl ("", Validators.compose([
                Validators.maxLength(MAX_LENGTH),
                Validators.minLength(MIN_LENGTH),
                Validators.required,
            ])),
            unchangedImage: new FormControl ("", Validators.compose([
                Validators.required,
                Validators.pattern(EXTENSION),
            ])),
            changedImage: new FormControl ("", Validators.compose([
                Validators.required,
                Validators.pattern(EXTENSION),
            ])),
        });
    }

    public getName(event: KeyboardEvent): void {
        this.nameInput = event.currentTarget as HTMLInputElement;
        this.name = this.nameInput.value;
    }

    public getOriginalFile(event: KeyboardEvent): void {
        try {
            this.enableUnchanged = false;
            this.uploadUnchanged = true;
            this.unchangedFile = event.currentTarget as HTMLInputElement;
            if (this.unchangedFile.files !== null) {
                this.originalFile = this.unchangedFile.files[0];
            }
            this.unchangedImgSize = this.originalFile.size;
            const unchangedReadFile: FileReader = new FileReader;
            unchangedReadFile.onload = () => {

                this.unchangedImage.onload = () => {
                this.unchangedWidth = this.unchangedImage.width;
                this.unchangedHeight = this.unchangedImage.height;
                if (this.unchangedHeight !== IMGHEIGHT || this.unchangedWidth !== IMGWIDTH) {
                    alert("Les dimensions de l'image doivent être 640 x 480");
                    this.enableUnchanged = false;
                } else {
                    this.enableUnchanged = true;
                }
                this.checkButton();
                };
                this.unchangedImage.src = unchangedReadFile.result as string;
            };
            unchangedReadFile.readAsDataURL(this.originalFile);
        } catch (e) {
            alert(e);
        }
    }

    public getModifiedFile(event: KeyboardEvent): void {
        this.enableChanged = false;
        this.uploadChanged = true;
        this.changedFile = event.currentTarget as HTMLInputElement;
        if (this.changedFile.files !== null) {
            this.modifiedFile = this.changedFile.files[0];
        }
        this.changedImgSize = this.modifiedFile.size;
        const modifiedReadFile: FileReader = new FileReader;
        modifiedReadFile.onload = () => {
            this.changedImage.onload = () => {
                this.changedWidth = this.changedImage.width;
                this.changedHeight = this.changedImage.height;
                if (this.changedHeight !== IMGHEIGHT || this.changedWidth !== IMGWIDTH) {
                    alert("Les dimensions de l'image doivent être 640 x 480");
                    this.enableChanged = false;
                } else {
                    this.enableChanged = true;
                }
                this.checkButton();
            };
            this.changedImage.src = modifiedReadFile.result as string;
        };
        modifiedReadFile.readAsDataURL(this.modifiedFile);
    }

    public checkButton(): void {
        this.enable = ( this.requiredForm.valid && this.enableUnchanged && this.enableChanged);
    }

    public submit(event: MouseEvent): void {
        this.checkButton();
        try {
            this.formImages.append("name", this.name, );
            this.formImages.append("originalImage", this.originalFile, this.originalFile.name);
            this.formImages.append("modifiedImage", this.modifiedFile, this.modifiedFile.name);
            this.http.post("http://localhost:3000/findDiff", this.formImages).subscribe((resp) => {
                if (typeof resp === "string") {
                    alert(resp);
                } else if (typeof resp === "number") {
                    if (resp === ERRORWANTED) {
                        this.http.post("http://localhost:3000/addGame2D", this.formImages).subscribe(() => {
                            void this.router.navigate(["/", "game-modes"]);
                            this.close(new MouseEvent("click"));
                        });
                    } else {
                        alert("Les images n'ont pas 7 differences.\nLe jeu n'a pas été créé.");
                    }
                }
            });
        } catch (error) {
            alert("Les images n'ont pas ete téléchargé");
        }
    }

    public close(event: MouseEvent): void {
        this.dialogRef.close();
    }
}
