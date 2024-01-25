import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { DataService } from "app/data.service";
import { AuthentificationService } from "app/authentification.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent {
  nom: any;
  prenom: any;
  email: any;
  phone: any;
  id: any;
  password: any;
  users: any;
  userOnline: any;
  role: any;
  type: any;

  displayedColumns: string[] = ["nom", "prenom", "email"];
  dataSource = new MatTableDataSource<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private authService: AuthentificationService
  ) {}
  getUser() {
    this.dataService.getUsers().subscribe(
      (data: any) => {
        if (Array.isArray(data.user)) {
          this.dataSource.data = data.user;
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
  onRecup6(id: any): void {
    this.dataService.getUsers().subscribe((data: any) => {
      this.users = data.user;
      for (let use of this.users) {
        if (id === use.id) {
          this.userOnline = use;
        }
      }
    });
  }
  ngOnInit() {
    this.getUser();
    this.onRecup6(this.authService.getUserId());
  }
  onSubmit(): void {
    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      id: this.id,
      password: this.password,
      role: this.role,
      type: this.type,
    };

    this.http
      .post("https://devcosit.com/auth/register", userData, {
        headers: this.authService.getHeaders(),
      })
      .subscribe(
        (response: any) => {
          this.getUser();
          this.nom;
          this.prenom = "";
          this.email = "";
          this.password = "";
          this.role = "";
          this.type = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
