/*
import { TestBed } from "@angular/core/testing";
import { platformBrowserDynamicTesting,
         BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
// @ts-ignore
import SocketMock from "socket.io-mock";
import {GameMessage} from "./messages/game-message";
import {MessageService} from "./messages/message.service";
import {WebSocketService} from "./socket.service";
import SpyObj = jasmine.SpyObj;

fdescribe("WebSocketService :", () => {
  let socketService: WebSocketService;

  const messageService: SpyObj<MessageService> =
    jasmine.createSpyObj("MessageService", {
      "addConnectionMessage": 0,
      "addDisconnectionMessage": 0,
      "addDifferenceFoundMessage": 0,
      "addIdentificationErrorMessage": 0,
      "addNewRecordMessage": 0,
    });

  beforeEach(() => {

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
                                platformBrowserDynamicTesting());
    void TestBed.configureTestingModule({
      providers: [
        {provide: MessageService, useValue: messageService},
      ],
    });

    socketService = TestBed.get(WebSocketService);
    socketService.socket = new SocketMock();
  });

  it("should be created", () => {
    expect(socketService).toBeTruthy();
  });

  describe("Fast and isolated socket tests", () => {

    it("Sockets should be able to talk to each other without a server", () => {
      const socket: SocketMock = new SocketMock();

      socket.on("message", (message: string) => {
        expect(message).toBe("Hello World!");
      });

      socket.socketClient.emit("message", "Hello World!");
    });
  });

  describe("Constructor (Testing event handlers for messages) :", () => {
    it("newConnection event should call MessageService.addConnectionMessage", () => {
      socketService.socket.on("newConnection", () => {
        expect(messageService.addConnectionMessage).toHaveBeenCalled();
      });

      socketService.socket.emit("newConnection", "Anonymous");
    });

    it("newDisconnection event shoud call MessageService.addDisconnectionMessage", () => {
      socketService.socket.on("Disconnection", () => {
        expect(messageService.addDisconnectionMessage).toHaveBeenCalled();
      });

      socketService.socket.emit("newDisconnection", "Anonymous");
    });

    it("newRecordMsg event shoud call MessageService.addNewRecordMessage", () => {
      socketService.socket.on("newRecordMsg", () => {
        expect(messageService.addNewRecordMessage).toHaveBeenCalled();
      });

      const gameMsgMock: GameMessage = {
        date: new Date(),
        userNameAuthor: "Anonymous",
        gameName: "none",
        position: "none",
        numberOfPlayers: "none",
      };

      socketService.socket.emit("newRecordMsg", gameMsgMock);
    });
  });

  describe("Emit function", () => {

    it("should emit data", () => {

      socketService.socket.on("emitDataEvent", (message: string) => {
        expect(message).toBe("data");
      });

      socketService.socket.emit("emitDataEvent", "data");
    });
  });

  describe("On function", () => {

    it("should receive data", () => {
      const socket: SocketMock = new SocketMock();

      socketService.socket.on("onDataEvent", (message: string) => {
        expect(message).toBe("data received");
      });

      socket.socketClient.emit("dataEvent", "data received");
    });
  });

});
*/