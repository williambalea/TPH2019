/*
import { HttpClient, HttpHandler } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material";
import { Router, RouterModule } from "@angular/router";
import { UserComponent } from "./user.component";

describe("UserComponent", () => {

    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
        declarations: [
            UserComponent,
            ],
        imports: [
            MatCardModule,
            ReactiveFormsModule,
            RouterModule,
        ],
        providers: [
            HttpClient,
            HttpHandler,
            {provide: Router, useValue: {}},
        ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        void expect(component).toBeTruthy();
    });

    it("#updateUsernameValidators() should refuse invalid user names", () => {
        const invalidUserName: string = "InvalidUsérName!" ;
        component.setUserName(invalidUserName);
        component.updateUserNameValidators();
        expect(component.userNameisValid()).toBe(false);
    });

    it("#updateUsernameValidators() should accept valid user names", () => {
        const validUserName: string = "validUserName" ;
        component.setUserName(validUserName);
        component.updateUserNameValidators();
        expect(component.userNameisValid()).toBe(true);
    });

});
*/