import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DataService } from "app/data.service";
import { AuthentificationService } from "app/authentification.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-membres",
  templateUrl: "./membres.component.html",
  styleUrl: "./membres.component.css",
})
export class MembresComponent {
  userId: any;
  projetId: any;
  role: any;
  users: any[];
  nom: any;
  prenom: any;
  members: any[] = [];

  displayedColumns: string[] = ["nom", "prenom", "role", "action"];
  dataSource = new MatTableDataSource<any>();
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private authService: AuthentificationService,
    private route: ActivatedRoute
  ) {}

  getMembers(id: any): void {
    this.http
      .post("http://localhost:5000/projet/getByID", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          console.log(response.projet.members);
          this.dataSource = response.projet.members;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ngOnInit() {
    this.getUser();
    this.projetId = this.route.snapshot.paramMap.get("projetId");
    this.getMembers(this.projetId);
  }
  selectUser(user: any): void {
    this.nom = user.nom;
    this.prenom = user.prenom;

    console.log("User selected", user);
  }
  addMember(): void {
    var nom = "";
    var prenom = "";
    for (let user of this.users) {
      if (this.userId === user.id) {
        nom = user.nom;
        prenom = user.prenom;
      }
    }
    const userData = {
      userId: this.userId,
      role: this.role,
      projetId: this.projetId,
      nom: nom,
      prenom: prenom,
    };
    console.log("data ", userData);
    const headers = this.authService.getHeaders();

    this.http
      .post("http://localhost:5000/projet/add-member", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.getMembers(this.projetId);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getUser() {
    this.dataService.getUsers().subscribe(
      (data: any) => {
        if (Array.isArray(data.user)) {
          this.users = data.user;
          console.log(data);
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
  onDelete(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer ce membre?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "http://localhost:5000/projet/delete-member",
          {
            memberId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            console.log("suppression effectuer");
            this.getMembers(this.projetId);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
