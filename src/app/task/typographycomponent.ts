import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { DataService } from "app/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs/operators";

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
  memberFormControl = new FormControl();
  filteredMembers: any[] = [];
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
    private authService: AuthentificationService
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

  openModal(content: any): NgbModalRef {
    return this.modalService.open(content, { centered: true });
  }
  onCatasks(id: any): void {
    this.http
      .post("http://localhost:5000/tache/getCatBy-projet", {
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

  onTasks(id: any): void {
    this.http
      .post("http://localhost:5000/tache/getTaskBy-category", {
        cat_TaskId: id,
      })
      .subscribe(
        (response: any) => {
          console.log(response.task);
          this.task_array = response.task;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onTasksByProjet(id: any): void {
    this.http
      .post("http://localhost:5000/tache/getTaskBy-projet", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          console.log(response.task);
          this.task_array = response.task;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onTaskDelete(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer cette tache?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "http://localhost:5000/tache//delete-task",
          {
            taskId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            console.log("suppression effectuer");
            // this.onTasks(this.cat_TaskId);
            this.onTasksByProjet(this.projetId);
            this.onCatasks(this.projetId);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  onTasksUser(): void {
    this.http
      .post("http://localhost:5000/tache/getTaskBy-user", {
        userId: this.authService.getUserId(),
      })
      .subscribe(
        (response: any) => {
          this.task_by_Users = response.task;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onEdit_task(): void {
    const userData = {
      title: this.title,
      desc: this.desc,
      id: this.id,
    };

    this.http
      .post("http://localhost:5000/tache/update-task", userData)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.onTasksByProjet(this.projetId);
          this.onTasks(this.cat_TaskId);
          this.title = "";
          this.desc = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onEdit_status(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir valider cette tache?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "http://localhost:5000/tache/update-task",
          { id: id, status: true },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            console.log(response);
            this.onTasks(this.cat_TaskId);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  onSubmit(): void {
    const userData = {
      title: this.title,
      desc: this.desc,
      projetId: this.projetId,
      cat_TaskId: this.cat_TaskId,
      userId: this.authService.getUserId(),
    };
    const headers = this.authService.getHeaders();

    this.http
      .post("http://localhost:5000/tache/add-task", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.onTasksByProjet(this.projetId);
          this.onCatasks(this.projetId);
          //this.onTasks(this.cat_TaskId);
          this.title = "";
          this.desc = "";
        },
        (error) => {
          console.log(error);
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
      }
    }
  }
  addCat() {
    const userData = {
      title: this.title,
      desc: this.desc,
      projetId: this.projetId,
    };

    this.http
      .post(
        "http://localhost:5000/tache/add-category",

        userData
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          this.onTasks(this.cat_TaskId);
          this.onCatasks(this.projetId);
          this.title = "";
          this.desc = "";
        },
        (error) => {
          console.log(error);
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
    const userData = {
      title: this.title,
      desc: this.desc,
      id: this.id,
      projetId: this.projetId,
    };

    this.http
      .post("http://localhost:5000/tache/update-category", userData)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.onTasks(this.cat_TaskId);
          this.onCatasks(this.projetId);
          this.title = "";
          this.desc = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onCatDelete(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer cette categorie??"
    );
    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "http://localhost:5000/tache/delete-category",
          {
            cat_TaskId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            console.log("suppression effectuer");
            this.onTasks(this.cat_TaskId);
            this.onCatasks(this.projetId);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  addMemberTask(): void {
    var nom = "";
    var prenom = "";
    for (let user of this.membersUsers) {
      if (this.userId === user.userId) {
        nom = user.nom;
        prenom = user.prenom;
      }
    }

    const userData = {
      userId: this.userId,
      nom: nom,
      prenom: prenom,
      taskId: this.taskId,
    };
    const headers = this.authService.getHeaders();

    this.http
      .post("http://localhost:5000/tache/add-member", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log("membre ajouter", response);
          nom = "";
          prenom = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getMembers(id: any): void {
    this.http
      .post("http://localhost:5000/projet/getByID", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          console.log(response.projet.members);
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
  onRecup6(id: any): void {
    this.dataService.getUsers().subscribe((data: any) => {
      this.alluse = data.user;
      for (let use of this.alluse) {
        if (id === use.id) {
          this.userOnline = use;
        }
      }
    });
    console.log(this.userOnline);
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
}
