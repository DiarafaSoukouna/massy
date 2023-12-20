import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  email: any;
  password: any;

  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        localStorage.setItem("token", response.token);
        this.router.navigate(["/dashboard"]);
      },
      (error) => {
        console.error("Erreur de connexion : ", error);
      }
    );
  }
}
