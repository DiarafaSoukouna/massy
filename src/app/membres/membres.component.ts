import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DataService } from "app/data.service";
import { AuthentificationService } from "app/authentification.service";
import { ActivatedRoute } from "@angular/router";
import { SocketService } from "app/socket.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-membres",
  templateUrl: "./membres.component.html",
  styleUrl: "./membres.component.css",
})
export class MembresComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userId: any;
  projetId: any;
  role: any;
  users: any[];
  nom: any;
  prenom: any;
  members: any;
  usertype: any;
  data: any;
  id: any;
  loading: boolean = false;
  allProjet: any[];
  projectName: string;

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
    private socket: SocketService,
    private _snackBar: MatSnackBar
  ) {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getMembers(id: any): void {
    this.http
      .post("https://devcosit.com/projet/getByID", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          this.dataSource.data = response.projet.members;
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
    this.getProjet();
    this.onRecup(this.projetId);
  }
  selectUser(user: any): void {
    this.nom = user.nom;
    this.prenom = user.prenom;
  }
  addMember(): void {
    this.loading = true;
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
      content: `Vous avez été ajoutés au projet "${this.projectName}" en tant que ${this.role}`,
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
          this.userId = "";
          this.nom = "";
          this.prenom = "";
          this.role = "";
          this.loading = false;
          this.openSnackBar("Membre ajouté avec succès !");
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
  }
  onRecup(id: any): void {
    const data = this.allProjet;
    for (let p of data) {
      if (p.id === id) {
        this.projectName = p.title;
      }
    }
  }
  getProjet() {
    this.dataService.getDonnees().subscribe((data: any) => {
      this.allProjet = data.projet;
      this.onRecup(this.projetId);
    });
  }
  clean() {
    this.userId = "";
    this.nom = "";
    this.prenom = "";
    this.role = "";
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
    const headers = this.authService.getHeaders();

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
          this.openSnackBar("La suppression a réussi !");
        },
        (error) => {
          console.log(error);
        }
      );
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
  openSnackBar(message: string) {
    this._snackBar.open(message, "Fermer", {
      duration: 3000,
    });
  }
}
