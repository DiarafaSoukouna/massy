import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";
import { HttpClient } from "@angular/common/http";

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

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private http: HttpClient
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

  onResetCode(mail: any): void {
    this.http
      .post("http://localhost:5000/user/resetPwd-code", {
        email: mail,
      })
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onResetPassword(): void {
    const data = {
      email: this.mail,
      password: this.password,
      code: this.code,
    };
    const headers = this.authService.getHeaders();
    this.http
      .post("http://localhost:5000/user/resetPwd-password", data, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
