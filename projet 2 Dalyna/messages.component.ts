import { Component, OnInit } from "@angular/core";
import { AuthService } from "../user/auth.service";
import { MessageService } from "./message.service";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})

export class MessagesComponent implements OnInit {

  public constructor(public messageService: MessageService, public authService: AuthService) {
  }

  public ngOnInit(): void {
    //
  }
}
