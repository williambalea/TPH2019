
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed, } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatCardModule, MatCheckboxModule,
         MatDialogModule, MatDialogRef, MatDividerModule, MatFormFieldModule, MatInputModule,
         MatSelectModule, MatTableModule, MAT_DIALOG_DATA} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { FvCreationPopupComponent } from "./fv-creation-popup.component";
import { Message } from "../../../../common/communication/message";
import { of } from "rxjs";

let mockRouter: { navigate: jasmine.Spy};
const event: MouseEvent = new MouseEvent("click");
const mockDialogRef: { close: jasmine.Spy} = {
    close: jasmine.createSpy("close"),
    };
const matDialogdataSpy: jasmine.Spy = jasmine.createSpy("MAT_DIALOG_DATA");
const OBJECT: number = 17;
const THEMATIQUE: string = "Thématique";
const FORME: string = "Formes géométriques";
const GAMENAME: string = "JeuDeMots";

const modules: (typeof MatDialogModule)[] = [
            MatDialogModule,
            MatDividerModule,
            MatTableModule,
            MatInputModule,
            MatSelectModule,
            MatFormFieldModule,
            MatCardModule,
            MatDialogModule,
            MatButtonModule,
            MatCheckboxModule,
            BrowserAnimationsModule,
            ReactiveFormsModule,
            HttpClientModule,

];

describe("FvCreationPopupComponent", () => {
    let component: FvCreationPopupComponent;
    let fixture: ComponentFixture<FvCreationPopupComponent>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    beforeEach(async(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["post"]);

        void TestBed.configureTestingModule({
            imports: [modules],
            declarations: [ FvCreationPopupComponent ],
            providers: [{ provide: MatDialogRef, useValue: mockDialogRef },
                        { provide: MAT_DIALOG_DATA, useValue: matDialogdataSpy },
                        { provide: Router, useValue: mockRouter},
                        {provide: HttpClient, useValue: httpClientSpy}, ]})
        .compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FvCreationPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should create an alert when it is submitted", () => {
        component.gameName = GAMENAME;
        component.gameTypeSelected = THEMATIQUE;
        component.numberOfObjects = OBJECT;
        component.canModifyColor = true;
        component.canAdd = true;
        component.canDelete = true;
        component.checkButton();
        component.submit(event);
        expect(component.submit).toThrow();
    });

    it("should go to scene3d page", () => {
        const expectedMessage: Message = { body: "Hello", title: "World" };
        httpClientSpy.post.and.returnValue(of(expectedMessage));
        
        component.gameName = GAMENAME;
        component.gameTypeSelected = FORME;
        component.numberOfObjects = OBJECT;
        component.canModifyColor = true;
        component.canAdd = true;
        component.canDelete = true;
        component.checkButton();
        component.submit(event);

        expect(httpClientSpy.post.calls.count()).toEqual(1);
    });
    
    it("should close a dialog when it is clicked", () => {
      component.close(event);
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

});
