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
    private authService: AuthentificationService
  ) {}

  ngOnInit() {
    this.getProject();
  }

  getProject() {
    this.dataService.getDonnees().subscribe(
      (data: any) => {
        if (Array.isArray(data.projet)) {
          this.dataSource.data = data.projet;

          console.log("All projet data", data.projet);

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
  // onDelete(id: any): Observable<any> {
  //   const token = this.getAccessToken();
  //   const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
  //   return this.http.post("http://192.168.1.14:5000/projet/delete", {
  //     projetId: id,
  //   });
  // }

  onDelete(id: any): void {
    const userConfirmed = window.confirm("Are you sure you want to delete?");

    if (userConfirmed) {
      this.http
        .post("http://localhost:5000/projet/delete", {
          projetId: id,
        })
        .subscribe(
          (response: any) => {
            console.log("Suppression exécutée");
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
        },
        (error) => {
          console.log(error);
          this.loadingModalRef.close();
        }
      );
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

    this.http.post("http://localhost:5000/projet/update", userData).subscribe(
      (response: any) => {
        console.log(response);

        this.getProject();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onClickProject(id: any): void {
    this.router.navigate(["/task", { projetId: id }]);
  }

  onClickProjectMembers(id: any): void {
    this.router.navigate(["/membres", { projetId: id }]);
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
}
