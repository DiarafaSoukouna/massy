import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DataService } from "app/data.service";
import { AuthentificationService } from "app/authentification.service";
import { ActivatedRoute } from "@angular/router";
import { SocketService } from "app/socket.service";

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
  members: any;
  usertype: any;
  data: any;

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
    private route: ActivatedRoute,
    private socket: SocketService
  ) {}

  getMembers(id: any): void {
    this.http
      .post("https://devcosit.com/projet/getByID", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
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
    this.getDataRole();
  }
  selectUser(user: any): void {
    this.nom = user.nom;
    this.prenom = user.prenom;
  }
  addMember(): void {
    var nom = "";
    var prenom = "";
    for (let user of this.users) {
      if (this.members === user.id) {
        nom = user.nom;
        prenom = user.prenom;
      }
    }
    const userData = {
      userId: this.members,
      role: this.role,
      projetId: this.projetId,
      nom: nom,
      prenom: prenom,
    };
    const headers = this.authService.getHeaders();

    const dataNotify = {
      userId: this.members,
      content: `Vous avez été ajoutés au projet "${this.authService.getProjetName()}" en tant que ${
        this.role
      }`,
      motif: "Projet",
    };

    this.http
      .post("https://devcosit.com/projet/add-member", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.getMembers(this.projetId);
          this.socket.sendNotify(dataNotify);
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
  getDataRole() {
    this.dataService.getDatasets().subscribe((data: any) => {
      this.data = data;
    });
  }

  onDelete(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer ce membre?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "https://devcosit.com/projet/delete-member",
          {
            memberId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            this.getMembers(this.projetId);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  onChange = () => {
    this.users.forEach((ele: any) => {
      if (
        this.userId.split(" ")[0] === ele.prenom.trim() &&
        this.userId.split(" ")[1] === ele.nom.trim()
      ) {
        this.members = ele.id;
      }
    });
  };
}
