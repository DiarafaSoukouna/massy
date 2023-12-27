import { Component } from "@angular/core";
import { AuthentificationService } from "app/authentification.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrl: "./confirmation.component.css",
})
export class ConfirmationComponent {
  type: any = "email";
  gateway: any;
  code: any;
  public loading = false;

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private http: HttpClient
  ) {}

  onLogin(type: string): void {
    this.loading = true;
    const headers = this.authService.getHeaders();

    this.http
      .post(
        "http://localhost:5000/auth/send-code",
        { gateway: this.authService.getUserMail(), type: type },
        { headers: headers }
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          this.loading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  verifyCode(): void {
    const headers = this.authService.getHeaders();

    this.http
      .post(
        "http://localhost:5000/auth/verify-code",
        { code: this.code },
        { headers: headers }
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          this.router.navigate(["/dashboard"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //  verifyCode(): void {
  //    this.authService.verifyCode(this.code).subscribe(
  //      (response) => {

  //        this.router.navigate(["/dashboard"]);
  //      },
  //      (error) => {
  //        console.error("Erreur de connexion : ", error);
  //      }
  //    );
  //  }
}
