
import { HttpClient, HttpHandler } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule, MatCheckboxModule, MatDialog, MatDialogConfig, MatDialogModule,
MatDividerModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { FvCreationPopupComponent } from "../fv-creation-popup/fv-creation-popup.component";
import { GameModesComponent } from "../game-modes/game-modes.component";
import { AdminTopMenuComponent } from "./admin-top-menu.component";

describe("AdminTopMenuComponent", () => {
    let component: AdminTopMenuComponent;
    let fixture: ComponentFixture<AdminTopMenuComponent>;
    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    beforeEach(async(() => { void
        TestBed.configureTestingModule({
        declarations: [
        AdminTopMenuComponent,
        GameModesComponent,
        FvCreationPopupComponent,
        ],
        imports: [
        MatCardModule,
        MatDialogModule,
        FormsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        ],
        providers: [
        HttpClient,
        HttpHandler,
        MatDialog,
        {provide: Router, useValue: {}},
        {provide: MatDialogConfig, useValue: {dialogConfig}},
        ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminTopMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("openFvDialog() should create popup", () => {
        component.openFvDialog();
        expect(component.dialog.openDialogs.length).toEqual(0);
    });

    it("openSvDialog() should create popup", () => {
        component.openSvDialog();
        expect(component.dialog.openDialogs.length).toEqual(0);
    });

});
