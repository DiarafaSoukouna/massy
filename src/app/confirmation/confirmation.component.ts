import { Component } from "@angular/core";
import { AuthentificationService } from "app/authentification.service";
import { Router } from "@angular/router";
import { LoginComponent } from "app/login/login.component";
@Component({
  selector: "app-confirmation",
  standalone: true,
  imports: [],
  templateUrl: "./confirmation.component.html",
  styleUrl: "./confirmation.component.css",
})
export class ConfirmationComponent {
  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}
  // sendCode(): void {
  //   this.authService.sendCode().subscribe(
  //     (response) => {
  //       console.log("data sent successfully");
  //     },
  //     (error) => {
  //       console.error("Erreur d'envoie : ", error);
  //     }
  //   );
  // }
  // verifyCode(): void {
  //   this.authService.verifyCode(this.code).subscribe(
  //     (response) => {

  //       this.router.navigate(["/dashboard"]);
  //     },
  //     (error) => {
  //       console.error("Erreur de connexion : ", error);
  //     }
  //   );
  // }
}
