import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";
import { HttpClient } from "@angular/common/http";
declare var $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  email: any;
  password: any;
  headers: any;
  mail: any;
  code: any;
  loginError: boolean = false;
  sendEmail: boolean = false;

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.setToken(response.access_token);
        this.authService.setUserMail(response.user.email);
        this.authService.setUserPhone(response.user.phone);
        this.router.navigate(["/confirmation"]);
      },
      (error) => {
        console.error("Erreur de connexion : ", error);
        this.loginError = true;

        setTimeout(() => {
          this.loginError = false;
        }, 5000);
      }
    );
  }

  onResetCode(): void {
    if (this.mail) {
      this.http
        .post("https://devcosit.com/user/resetPwd-code", {
          email: this.mail,
        })
        .subscribe(
          (response: any) => {
            $("#passwordModal").modal("show");
          },
          (error) => {
            console.log(error);
            this.sendEmail = true;

            setTimeout(() => {
              this.sendEmail = false;
            }, 5000);
          }
        );
    } else {
      this.sendEmail = true;

      setTimeout(() => {
        this.sendEmail = false;
      }, 5000);
    }
  }

  onResetPassword(): void {
    const data = {
      email: this.mail,
      password: this.password,
      code: this.code,
    };
    const headers = this.authService.getHeaders();
    this.http
      .post("https://devcosit.com/user/resetPwd-password", data, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.router.navigate(["/dashboard"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
