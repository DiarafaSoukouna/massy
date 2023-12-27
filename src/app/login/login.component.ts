import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";
import { log } from "console";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  email: any;
  password: any;
  headers: any;

  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.setToken(response.access_token);
        this.authService.setUserId(response.user.id);
        this.authService.setUserMail(response.user.email);
        this.authService.setUserPhone(response.user.phone);
        this.router.navigate(["/confirmation"]);
        console.log(response);
      },
      (error) => {
        console.error("Erreur de connexion : ", error);
      }
    );
  }
}
