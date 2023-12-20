import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { DataService } from "app/data.service";

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

  displayedColumns: string[] = ["nom", "prenom", "email"];
  dataSource = new MatTableDataSource<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService
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

  ngOnInit() {
    this.getUser();
  }
  onSubmit(): void {
    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      id: this.id,
      password: this.password,
    };

    this.http
      .post("http://192.168.1.14:5000/auth/register", userData)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.getUser();
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
