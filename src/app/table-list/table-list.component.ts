import { Component, OnInit, ViewChild } from "@angular/core";
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
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
})
export class TableListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private tokenKey = "accessToken";
  loadingModalRef: NgbModalRef;
  loadingModal: NgbModal;
  loading: boolean = false;
  showConfirmation = false;
  projet_array: any[];
  selectedTabIndex: number = 0;
  dataForTab2: any;
  dataForTab1: any;
  test: any;
  dataForTab3: any;
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
  recup: any;

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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
    private dataService: DataService,
    private authService: AuthentificationService,
    private socket: SocketService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getProject();

    this.onRecup6(this.authService.getUserId());
  }

  getProject() {
    this.dataService.getDonnees().subscribe(
      (data: any) => {
        if (Array.isArray(data.projet)) {
          this.test = data.projet
            .map(
              (projet: any) =>
                projet.members
                  .map((member: any) => member.userId)
                  .includes(this.authService.getUserId()) && projet
            )
            .filter((projet: any) => projet !== false);
          this.dataForTab2 = this.test.filter(
            (data: any) => data.status > "0" && data.status !== "100"
          );
          this.dataForTab3 = this.test.filter(
            (data: any) => data.status === "100"
          );

          this.dataForTab1 = this.test.filter(
            (data: any) => data.status === "0"
          );
          this.loadDataForTab1();
          this.loadDataForTab2();
          this.loadDataForTab3();
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
  openSnackBar(message: string) {
    this.loading = true;
    this._snackBar.open(message, "Fermer", {
      duration: 3000,
    });
    this.loading = false;
  }

  onDelete(id: any): void {
    const headers = this.authService.getHeaders();

    this.http
      .post(
        "https://devcosit.com/projet/delete",
        {
          projetId: id,
        },
        { headers: headers }
      )
      .subscribe(
        (response: any) => {
          this.getProject();

          this.id = "";
          this.openSnackBar("La suppression a réussi !");
        },
        (error) => {
          console.log(error);
          this.getProject();
        }
      );
  }

  onSubmit(event: Event): void {
    this.loading = true;
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
      .post("https://devcosit.com/projet/add", userData, { headers })
      .subscribe(
        (response: any) => {
          this.loadingModalRef.close();
          this.modalService.dismissAll();
          this.getProject();
          this.title = "";
          this.desc = "";
          this.date_deb = "";
          this.date_fin = "";
          this.loading = false;
          this.openSnackBar("Projet créé avec succes!");
        },
        (error) => {
          console.log(error);
          this.loadingModalRef.close();
          this.loading = false;
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
    this.loading = true;
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
      .post("https://devcosit.com/projet/update", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.getProject();
          this.title = "";
          this.desc = "";
          this.date_deb = "";
          this.date_fin = "";
          this.budg_prev = "";
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
    const data = this.test;
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
      .post("https://devcosit.com/user/add-notify", {
        userId: userId,
        content: content,
        motif: motif,
      })
      .subscribe(
        (response: any) => {},
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
  clean() {
    this.title = "";
    this.desc = "";
    this.date_deb = "";
    this.date_fin = "";
    this.budg_prev = "";
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;

    switch (this.selectedTabIndex) {
      case 0:
        this.dataSource = this.dataForTab1;
        break;
      case 1:
        this.dataSource = this.dataForTab2;
        break;
      case 2:
        this.dataSource = this.dataForTab3;
        break;
    }
  }

  loadDataForTab1(): void {
    setTimeout(() => {
      if (this.selectedTabIndex === 0) {
        this.dataSource = this.dataForTab1;
      }
    }, 1000);
  }

  loadDataForTab2(): void {
    setTimeout(() => {
      if (this.selectedTabIndex === 1) {
        this.dataSource = this.dataForTab2;
      }
    }, 1000);
  }

  loadDataForTab3(): void {
    setTimeout(() => {
      if (this.selectedTabIndex === 2) {
        this.dataSource = this.dataForTab3;
      }
    }, 1000);
  }
  ouvrirModalConfirmation(): void {
    this.modalService.open("confirmationModal", { centered: true });
  }
}
