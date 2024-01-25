import { Component } from "@angular/core";
import { AuthentificationService } from "app/authentification.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
declare var $: any;

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
  verifyMail: boolean = false;

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
        "https://devcosit.com/auth/send-code",
        { gateway: this.authService.getUserMail(), type: type },
        { headers: headers }
      )
      .subscribe(
        (response: any) => {
          $("#emailModal").modal("show");
          console.log(response);
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
        "https://devcosit.com/auth/verify-code",
        { code: this.code },
        { headers: headers }
      )
      .subscribe(
        (response: any) => {
          this.authService.setUserId(response.user.id);

          if (response.user) {
            if (response.user.account.single_on === true) {
              this.router.navigate(["/reset-password"]);
            } else {
              this.router.navigate(["/dashboard"]);
            }
          } else {
            //code incorrect !
          }
        },
        (error) => {
          console.log(error);
          this.verifyMail = true;

          setTimeout(() => {
            this.verifyMail = false;
          }, 5000);
        }
      );
  }
}
