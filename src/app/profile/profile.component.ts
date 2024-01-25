import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "app/data.service";
import { AuthentificationService } from "app/authentification.service";
import { HttpClient } from "@angular/common/http";
declare var $: any;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  users: any[];
  nom: any;
  prenom: any;
  email: any;
  phone: any;
  mail: any;
  password: any;
  code: any;
  sendEmail: boolean = false;
  verifyCode: boolean = false;
  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthentificationService,
    private http: HttpClient
  ) {}
  retour() {
    this.router.navigate(["/dashboard"]);
  }

  getUser() {
    this.dataService.getUsers().subscribe(
      (data: any) => {
        if (Array.isArray(data.user)) {
          this.users = data.user;
          this.onRecup(this.authService.getUserId());
        } else {
          console.error("Les données ne sont pas un tableau :", data);
        }
      },
      (error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des données :",
          error
        );
      }
    );
  }
  ngOnInit() {
    this.getUser();
  }

  onRecup(id: any): void {
    const data = this.users;
    for (let user of data) {
      if (user.id === id) {
        this.nom = user.nom;
        this.prenom = user.prenom;
        this.email = user.email;
        this.phone = user.phone;
      }
    }
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
  getInitials(nom: string, prenom: string): string {
    return nom.charAt(0).toUpperCase() + prenom.charAt(0).toUpperCase();
  }
  dashboard() {
    this.router.navigate(["/dashboard"]);
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
        (response: any) => {},
        (error) => {
          console.log(error);
          this.verifyCode = true;

          setTimeout(() => {
            this.verifyCode = false;
          }, 5000);
        }
      );
  }
}
