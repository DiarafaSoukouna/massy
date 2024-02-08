import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { DataService } from "app/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";

interface Card {
  content: string;
  inputs: { value: string }[];
  title: string;
}

@Component({
  selector: "app-typography",
  templateUrl: "./typography.component.html",
  styleUrls: ["./typography.component.css"],
})
export class TypographyComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  cards: Card[] = [];
  card: any[];
  title: any;
  id: any;
  desc: any;
  cat_TaskId: any;
  projetId: any;
  projectTasks: any[];
  task_array: any[];
  task_by_Users: any[];
  taskId: any;
  status: true;
  users: any[];
  userId: any;
  membersUsers: any[];
  allCat: any;
  taskid: any[];
  alluse: any;
  userOnline: any;
  allprojets: any;
  searchTerm: any;
  deadline: any;
  memberFormControl = new FormControl();
  filteredMembers: any[] = [];
  selectedTabIndex: number = 0;
  test: any;
  loading: boolean = false;
  displayedColumns: string[] = ["title", "steps", "deadline", "action"];
  dataSource = new MatTableDataSource<any>();
  dataForTab1 = new MatTableDataSource<any>();
  dataForTab2 = new MatTableDataSource<any>();
  dataForTab3 = new MatTableDataSource<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.projetId = this.route.snapshot.paramMap.get("projetId");
    this.onCatasks(this.projetId);
    this.onTasks(this.cat_TaskId);
    this.onTasksUser();
    this.getMembers(this.projetId);
    this.onRecup6(this.authService.getUserId());
    this.getProject();
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthentificationService,
    private _snackBar: MatSnackBar
  ) {
    this.memberFormControl.valueChanges
      .pipe(
        startWith(""),
        map((value) => this._filterMembers(value))
      )
      .subscribe((filteredMembers) => {
        this.filteredMembers = filteredMembers;
      });
  }

  onCatasks(id: any): void {
    this.http
      .post("https://devcosit.com/tache/getCatBy-projet", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          this.projectTasks = response.task.filter(
            (cat: any) => cat.tasks.length !== 0
          );
          this.allCat = response.task;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, "Fermer", {
      duration: 3000,
    });
  }
  onTasks(id: any): void {
    this.http
      .post("https://devcosit.com/tache/getTaskBy-category", {
        cat_TaskId: id,
      })
      .subscribe(
        (response: any) => {
          this.task_array = response.task;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onTasksByProjet(id: any): void {
    this.http
      .post("https://devcosit.com/tache/getTaskBy-projet", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          this.task_array = response.task;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onTaskDelete(id: any): void {
    const headers = this.authService.getHeaders();

    this.http
      .post(
        "https://devcosit.com/tache//delete-task",
        {
          taskId: id,
        },
        { headers: headers }
      )
      .subscribe(
        (response: any) => {
          this.onTasksByProjet(this.projetId);
          this.onCatasks(this.projetId);
          this.id = "";
          this.openSnackBar("Suppression effectuée avec succès !");
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onTasksUser(): void {
    this.http
      .post("https://devcosit.com/tache/getTaskBy-assign", {
        userId: this.authService.getUserId(),
      })
      .subscribe(
        (response: any) => {
          this.task_by_Users = response.task;
          console.log(this.task_by_Users);
          this.dataForTab1.data = this.task_by_Users.filter(
            (data: any) => data.steps === "Nouvelle"
          );

          this.dataForTab2.data = this.task_by_Users.filter(
            (data: any) => data.steps === "En cours"
          );
          this.dataForTab3.data = this.task_by_Users.filter(
            (data: any) => data.steps === "Terminée"
          );

          this.loadDataForTab1();
          this.loadDataForTab2();
          this.loadDataForTab3();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onEdit_task(): void {
    this.loading = true;
    const userData = {
      title: this.title,
      desc: this.desc,
      id: this.id,
      deadline: this.deadline,
      cat_TaskId: this.cat_TaskId,
      userId: this.authService.getUserId(),
    };
    const headers = this.authService.getHeaders();

    this.http
      .post("https://devcosit.com/tache/update-task", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.onTasksByProjet(this.projetId);
          this.onCatasks(this.projetId);
          this.title = "";
          this.desc = "";
          this.deadline = "";
          this.loading = false;

          this.openSnackBar("Modification effectuée avec succès !");
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
  }
  onStart(id: any) {
    this.loading = true;

    const headers = this.authService.getHeaders();

    this.http
      .post(
        "https://devcosit.com/tache/update-task",
        { steps: "En cours", id: id },
        {
          headers: headers,
        }
      )
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.router.navigate(["/task-details", { taskId: id }]);
          this.openSnackBar("Vous avez commencé la tâche avec succès!");
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
  }

  onFinish(id: any) {
    this.loading = true;

    const headers = this.authService.getHeaders();

    this.http
      .post(
        "https://devcosit.com/tache/update-task",
        { id: id, steps: "Terminée" },
        {
          headers: headers,
        }
      )
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.onTasks(this.cat_TaskId);
          this.openSnackBar("Vous avez terminé la tâche avec succès!");
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onEdit_status(id: any): void {
    this.loading = true;

    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir valider cette tache?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "https://devcosit.com/tache/update-task",
          { id: id, status: true },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            this.loading = false;
            this.onTasks(this.cat_TaskId);

            this.openSnackBar("Vous avez validé la tâche avec succès!");
          },
          (error) => {
            console.log(error);
            this.loading = false;
          }
        );
    }
  }

  onSubmit(): void {
    this.loading = true;

    const userData = {
      title: this.title,
      desc: this.desc,
      projetId: this.projetId,
      cat_TaskId: this.cat_TaskId,
      deadline: this.deadline,
      userId: this.authService.getUserId(),
    };
    const headers = this.authService.getHeaders();

    this.http
      .post("https://devcosit.com/tache/add-task", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.onTasksByProjet(this.projetId);
          this.onCatasks(this.projetId);
          //this.onTasks(this.cat_TaskId);
          this.title = "";
          this.desc = "";
          this.deadline = "";
          this.loading = false;
          this.openSnackBar("Tâche ajouté avec succès!");
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
  }
  onRecup(id: any): void {
    const data = this.task_array;
    for (let task_array of data) {
      if (task_array.id === id) {
        this.title = task_array.title;
        this.desc = task_array.desc;
        this.id = task_array.id;
        this.deadline = task_array.deadline;
        this.cat_TaskId = task_array.cat_TaskId;
      }
    }
  }
  clean() {
    this.title = "";
    this.desc = "";
    this.deadline = "";
  }
  addCat() {
    this.loading = true;

    const userData = {
      title: this.title,
      desc: this.desc,
      projetId: this.projetId,
    };

    this.http
      .post(
        "https://devcosit.com/tache/add-category",

        userData
      )
      .subscribe(
        (response: any) => {
          this.onTasks(this.cat_TaskId);
          this.onCatasks(this.projetId);
          this.title = "";
          this.desc = "";
          this.loading = false;
          this.openSnackBar("Catégorie ajoutée avec succès!");
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
  }
  onRecupCat(id: any): void {
    const data = this.projectTasks;
    for (let projectTasks of data) {
      if (projectTasks.id === id) {
        this.title = projectTasks.title;
        this.desc = projectTasks.desc;
        this.id = projectTasks.id;
      }
    }
  }
  onEdit_Cat(): void {
    this.loading = true;

    const userData = {
      title: this.title,
      desc: this.desc,
      id: this.id,
      projetId: this.projetId,
    };

    this.http
      .post("https://devcosit.com/tache/update-category", userData)
      .subscribe(
        (response: any) => {
          this.onTasks(this.cat_TaskId);

          this.onTasksByProjet(this.projetId);
          this.title = "";
          this.desc = "";
          this.loading = false;
          this.openSnackBar("Catégorie modifiée avec succès!");
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
  }
  onCatDelete(id: any): void {
    this.loading = true;

    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer cette categorie??"
    );
    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "https://devcosit.com/tache/delete-category",
          {
            cat_TaskId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            this.loading = false;
            this.onTasks(this.cat_TaskId);
            this.onCatasks(this.projetId);
            this.openSnackBar("Catégorie supprimée avec succès!");
          },
          (error) => {
            console.log(error);
            this.loading = false;
          }
        );
    }
  }

  getMembers(id: any): void {
    this.http
      .post("https://devcosit.com/projet/getByID", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          this.membersUsers = response.projet.members;
          this.filteredMembers = this.membersUsers;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onClickTask(id: any, cat_TaskId: any): void {
    this.router.navigate([
      "/task-details",
      { taskId: id, cat_TaskId: cat_TaskId, projectId: this.projetId },
    ]);
  }
  onClickTaskNote(id: any, cat_TaskId: any): void {
    this.router.navigate([
      "/task-details",
      { taskId: id, cat_TaskId: cat_TaskId },
    ]);
  }
  onClickOneTask(id: any): void {
    this.router.navigate(["/one-task", { taskId: id }]);
  }
  onClickproject(id: any): void {
    this.projetId = this.route.snapshot.paramMap.get("projetId");
    this.router.navigate(["/task", { projetId: id }]);
  }
  onRecup6(id: any): void {
    this.dataService.getUsers().subscribe((data: any) => {
      this.alluse = data.user;
      for (let use of this.alluse) {
        if (id === use.id) {
          this.userOnline = use;
        }
      }
    });
  }
  getProject() {
    this.dataService.getDonnees().subscribe((data: any) => {
      this.allprojets = data.projet;
    });
  }
  oneProjet(id: any) {
    for (let v of this.allprojets) {
      if (v.id === id) {
        return v.title;
      }
    }
  }
  get filteredTasks() {
    return this.task_by_Users.filter(
      (task) =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.oneProjet(task.projetId)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }
  private _filterMembers(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.membersUsers.filter(
      (member) =>
        member.nom.toLowerCase().includes(filterValue) ||
        member.prenom.toLowerCase().includes(filterValue)
    );
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
}
