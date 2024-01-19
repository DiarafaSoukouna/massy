import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs";
import { DataService } from "app/data.service";
import { HttpHeaders } from "@angular/common/http";
import { AuthentificationService } from "app/authentification.service";
import { DataSource } from "@angular/cdk/collections";
import { SocketService } from "app/socket.service";

@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
})
export class TableListComponent {
  private tokenKey = "accessToken";
  loadingModalRef: NgbModalRef;
  loadingModal: NgbModal;
  loading: boolean = false;
  showConfirmation = false;
  projet_array: any[];

  title: any;
  desc: any;
  date_deb: any;
  date_fin: any;
  budg_prev: any;
  id: any;
  projet_array1: any;
  status: any;
  users: any;
  userOnline: any;

  displayedColumns: string[] = [
    "title",
    "date_deb",
    "date_fin",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
    private dataService: DataService,
    private authService: AuthentificationService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    this.getProject();
    this.onRecup6(this.authService.getUserId());
  }

  getProject() {
    this.dataService.getDonnees().subscribe(
      (data: any) => {
        if (Array.isArray(data.projet)) {
          this.dataSource.data = data.projet;

          this.dataSource.data = data.projet
            .map(
              (projet: any) =>
                projet.members
                  .map((member: any) => member.userId)
                  .includes(this.authService.getUserId()) && projet
            )
            .filter((projet: any) => projet !== false);
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
    const userConfirmed = window.confirm("Are you sure you want to delete?");
    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "http://localhost:5000/projet/delete",
          {
            projetId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            console.log("Suppression exécutée", response);
            this.getProject();
          },
          (error) => {
            console.log(error);
            this.getProject();
          }
        );
    }
  }
  onSubmit(event: Event): void {
    event.preventDefault();

    this.loadingModalRef = this.modalService.open(this.loadingModal);

    const userData = {
      title: this.title,
      desc: this.desc,
      date_deb: this.date_deb,
      date_fin: this.date_fin,
      budg_prev: this.budg_prev,
      id: this.id,
      userId: this.authService.getUserId(),
    };
    const headers = this.authService.getHeaders();
    const access_token = this.authService.getToken();

    this.http
      .post("http://localhost:5000/projet/add", userData, { headers })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.loadingModalRef.close();
          this.modalService.dismissAll();
          this.getProject();
          this.title = "";
          this.desc = "";
          this.date_deb = "";
          this.date_fin = "";
        },
        (error) => {
          console.log(error);
          this.loadingModalRef.close();
        }
      );
  }
  onProjet(id: any): void {
    const data = this.dataSource.data;
    for (let datasource of data) {
      if (datasource.id === id) {
        this.authService.setProjetName(datasource.title);
      }
    }
  }
  onEdit(): void {
    const userData = {
      title: this.title,
      desc: this.desc,
      date_deb: this.date_deb,
      date_fin: this.date_fin,
      budg_prev: this.budg_prev,
      id: this.id,
    };
    const headers = this.authService.getHeaders();
    this.http
      .post("http://localhost:5000/projet/update", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.getProject();
          this.title = "";
          this.desc = "";
          this.date_deb = "";
          this.date_fin = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onClickProject(id: any): void {
    this.router.navigate(["/task", { projetId: id }]);
    this.onProjet(id);
  }
  onClickView(id: any): void {
    this.router.navigate(["/project-details", { projetId: id }]);
    this.onProjet(id);
  }

  onClickProjectMembers(id: any): void {
    this.router.navigate(["/membres", { projetId: id }]);
    this.onProjet(id);
  }

  onRecup(id: any): void {
    const data = this.dataSource.data;
    for (let datasource of data) {
      if (datasource.id === id) {
        this.title = datasource.title;
        this.desc = datasource.desc;
        this.date_deb = datasource.date_deb;
        this.date_fin = datasource.date_fin;
        this.budg_prev = datasource.budg_prev;
        this.id = datasource.id;
      }
    }
  }

  getProgressBarColor(status: number): string {
    if (status < 30) {
      return "red";
    } else if (status < 60) {
      return "orange";
    } else {
      return "green";
    }
  }
  addCat(userId: any, content: any, motif: string) {
    this.http
      .post("http://localhost:5000/user/add-notify", {
        userId: userId,
        content: content,
        motif: motif,
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
}
