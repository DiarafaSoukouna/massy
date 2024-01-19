import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "app/data.service";
import { AuthentificationService } from "app/authentification.service";
import { HttpClient } from "@angular/common/http";

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
  loading: boolean;
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

  onResetCode(mail: any): void {
    this.loading = true;
    this.http
      .post("http://localhost:5000/user/resetPwd-code", {
        email: mail,
      })
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
