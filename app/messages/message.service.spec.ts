
import { TestBed } from "@angular/core/testing";

import {platformBrowserDynamicTesting,
  BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import {GameMessage} from "./game-message";
import { MessageService } from "./message.service";

fdescribe("MessageService", () => {
  let messageService: MessageService;

  const date: Date = new Date();
  const userName: string = "Anonymous";

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
                                platformBrowserDynamicTesting());
    TestBed.configureTestingModule({});
    messageService = TestBed.get(MessageService);
  });

  it("should be created", () => {
    expect(messageService).toBeTruthy();
  });

  describe( "#addConnectionMessage", () => {
    it("should add a new connection message in the messages list", () => {
      messageService.addConnectionMessage(userName, date);
      const msg: string = messageService.getMessages().pop() as string;
      expect(msg.includes(MessageService.JUST_CONNECTED) && msg.includes(userName)).toBe(true);
    });
  });

  describe("#addDisconnectionMessage", () => {
    it("should add a new disconnection message in the messages list", () => {
      messageService.addDisconnectionMessage(userName, date);
      const msg: string = messageService.getMessages().pop() as string;
      expect(msg.includes(MessageService.JUST_DISCONNECTED) && msg.includes(userName)).toBe(true);
    });
  });

  describe("addDifferenceFoundMessage", () => {
    it("should add a new difference found message in the messages list", () => {
      messageService.addDifferenceFoundMessage(date);
      const msg: string = messageService.getMessages().pop() as string;
      expect(msg.includes(MessageService.DIFFERENCE_FOUND)).toBe(true);
    });
  });

  describe("addIdentificationErrorMessage", () => {
    it("should add a new error message in the messages list", () => {
      messageService.addIdentificationErrorMessage(date);
      const msg: string = messageService.getMessages().pop() as string;
      expect(msg.includes(MessageService.ERROR)).toBe(true);
    });
  });

  describe("addNewRecordMessage", () => {
    it("should add a new record message in the messages list", () => {
      const newRecordMsg: GameMessage = {
        date: date,
        userNameAuthor: userName,
        gameName: "test",
        position: "première",
        numberOfPlayers: "solo"};

      messageService.addNewRecordMessage(newRecordMsg);
      const msg: string = messageService.getMessages().pop() as string;
      expect(msg.includes(newRecordMsg.userNameAuthor) && msg.includes(newRecordMsg.position));
    });
  });

  describe("send function", () => {
    it("send should add a message", () => {
      messageService.send("test");
      const msg: string = messageService.getMessages().pop() as string;
      expect(msg).toEqual("test");
    });
  });

  describe("clear function", () => {
    it("should clear messages", () => {
      messageService.send("hello");
      messageService.clear();
      expect(messageService.getMessages().length).toBe(0);
    });
  });

  describe("formatNumber function", () => {
    it("if x < 10, should return '0x'", () => {
      expect(messageService.formatNumber(1)).toEqual("01");
    });

    it("if x > 10, should return 'x'", () => {
      const testValue: number = 15;
      expect(messageService.formatNumber(testValue)).toEqual("15");
    });
  });

});
