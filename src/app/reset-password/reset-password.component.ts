import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";
declare var $: any;

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.css",
})
export class ResetPasswordComponent {
  mail: any;
  password: string;
  code: string;
  sendEmail: boolean = false;
  verifyCode: boolean = false;

  constructor(
    private authService: AuthentificationService,
    private http: HttpClient,
    private router: Router
  ) {}
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
          this.verifyCode = true;

          setTimeout(() => {
            this.verifyCode = false;
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
}
