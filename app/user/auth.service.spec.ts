/*
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { Messages, ServerResponse } from "../../../../common/communication/auth-communication";
import { TestHelper } from "../../test.helper";
import { AuthService } from "./auth.service";

describe("AuthService :", () => {
    let authService: AuthService;
    const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj("HttpClient", ["post", "get"]);

    const fakeUsername: string = "Anonymous";
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: "test 404 error",
        status: 404, statusText: "Not Found",
    });

    beforeEach(() => {
        TestBed.resetTestEnvironment();
        TestBed.initTestEnvironment(BrowserDynamicTestingModule,
                                    platformBrowserDynamicTesting());
        void TestBed.configureTestingModule({
        providers: [
             {provide: HttpClient, useValue: httpClientSpy},
        ],
        });

        authService = TestBed.get(AuthService);
    });

    afterAll( () => {
        TestBed.resetTestingModule();
    });

    it("should be created", () => {
        expect(authService).toBeTruthy();
    });

    describe("#getUsersList :", () => {

        it("should return online users if http request is successul", () => {
            const expectedUsers: string[] =
                ["Marc", "John", "Anon", "Nymous"];
            httpClientSpy.get.and.returnValue(TestHelper.asyncData(expectedUsers));
            authService.getUsersList().then(
                (users) => expect(users).toEqual(expectedUsers, "expected users"),
                fail,
            );
            expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
        });

        it("should return an error when the server returns a 404", () => {
            httpClientSpy.get.and.returnValue(TestHelper.asyncError(errorResponse));
            authService.getUsersList().then(
                (_) => expect().nothing(),
                (error) => expect(error.message).toContain("test 404 error"),
            );
        });
    });

    describe("#registerUser :", () => {
        const serverOK: ServerResponse = { serverResponse: Messages.USERNAME_APPROOVED_SERVER_RESPONSE };
        const serverNOTOK: ServerResponse = { serverResponse: Messages.USERNAME_REFUSED_SERVER_RESPONSE };
        const nonAvailableUserName: ServerResponse = { serverResponse: Messages.USERNAME_NON_AVAILABLE };

        it("should set userName correctly if http request is successful", () => {
            httpClientSpy.post.and.returnValue(TestHelper.asyncData(serverOK));
            void authService.registerUser(fakeUsername).then((_) => expect(authService.userName).toBe(fakeUsername));
        });

        it("should authenticate the client if http request is successful", () => {
            httpClientSpy.post.and.returnValue(TestHelper.asyncData(serverOK));
            void authService.registerUser(fakeUsername).then((_) => expect(authService.isAuthenticated).toBe(true));
        });

        it("should not set userName if http request is not successful", () => {
            httpClientSpy.post.and.returnValue(TestHelper.asyncData(serverNOTOK));
            void authService.registerUser(fakeUsername).then((_) => expect(authService.userName).toBe(""));
        });

        it("should not authenticate the client if http request is not successful", () => {
            httpClientSpy.post.and.returnValue(TestHelper.asyncData(serverNOTOK));
            void authService.registerUser(fakeUsername).then((_) => expect(authService.isAuthenticated).toBe(false));
        });

        it("should not authenticate the client if userName is already in database", () => {
            httpClientSpy.post.and.returnValue(TestHelper.asyncData(nonAvailableUserName));
            void authService.registerUser(fakeUsername).then((_) => expect(authService.isAuthenticated).toBe(false));
        });

        it("should return an error when the server returns a 404", () => {
            httpClientSpy.post.and.returnValue(TestHelper.asyncError(errorResponse));
            authService.registerUser("Anonymous").then(
                (_) => expect().nothing() ,
                (error) => expect(error.message).toContain("test 404 error"),
            );
        });

    });

    describe("#deleteUser :", () => {

        it("should deleteUser correctly", () => {
            httpClientSpy.post.and.returnValue(TestHelper.asyncData(0));
            void authService.deleteUser().then(
                () => expect(authService.isDeleted).toBe(true),
            );
        });
    });

});
*/