import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

const MIN_LENGTH: number = 4;
const MAX_LENGTH: number = 15;

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {

  // Retreives all connected users in this array
  protected users: string[];
  protected userName: string;
  protected enable: boolean;
  protected userNameIsAvailable: boolean;
  protected requiredForm: FormGroup;
  protected validationMessages: { "username": { type: string; message: string; } []; } = {
    "username": [
      {type: "required", message: "Username is required"},
      {type: "minlength", message: "Username must be at least 4 characters long"},
      {type: "maxlength", message: "Username cannot be more than 15 characters long"},
      {type: "pattern", message: "Your username must contain only numbers and letters"},
      {type: "userNameTaken", message: "user name already taken !"},
    ],
  };

  public constructor(private authService: AuthService, public router: Router) {
    this.users = [];
    this.userName = "";
    this.enable = false;
    this.userNameIsAvailable = false;
    this.requiredForm = new FormGroup({
      username: new FormControl("", Validators.compose([
        Validators.maxLength(MAX_LENGTH),
        Validators.minLength(MIN_LENGTH),
        Validators.pattern("[a-zA-Z0-9]*"),
        Validators.required,
      ])),
    });
  }

  public ngOnInit(): void {
    this.getOnlineUsers();
  }

  public setUserName(userName: string): void {
    this.userName = userName;
  }

  public userNameisValid(): boolean {
    return this.enable;
  }

  public updateUserNameValidators(): void {
    this.userNameIsAvailable = this.userNameDoesNotExist();
    this.enable = this.requiredForm.valid && this.userNameIsAvailable;
  }

  protected getRequiredForm(): FormGroup {
    return this.requiredForm;
  }

  protected getOnlineUsers(): void {
    void this.authService.getUsersList()
      .then((users: string[]) => {
        this.users = users;
      });
  }

  protected submit(): void {
    if (this.userNameIsAvailable && this.enable) {
      void this.registerUserName().then(() => {
        // Last check to make sure the userName was not taken in the mean time
        if (this.authService.isAuthenticated) {
          void this.router.navigate(["/", "game-modes"]);
        } else {
          this.userNameIsAvailable = false;
        }
      });
    }
  }

  protected async registerUserName(): Promise<void> {
    return this.authService.registerUser(this.userName)
      .then(() => {
        // get the updated users list
        this.getOnlineUsers();
      });
  }

  private userNameDoesNotExist(): boolean {
    return this.users.indexOf(this.userName) === -1;
  }
}
