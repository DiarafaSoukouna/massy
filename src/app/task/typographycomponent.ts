import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { DataService } from "app/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";
import { log } from "console";

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

  ngOnInit() {
    this.projetId = this.route.snapshot.paramMap.get("projetId");
    this.onCatasks(this.projetId);
    this.onTasks(this.cat_TaskId);
    this.onTasksUser();
    this.getMembers(this.projetId);
  }

  saveContent(index: number) {
    localStorage.setItem(`card${index + 1}`, this.cards[index].content);
  }

  // loadContent() {
  //   for (let i = 1; i <= 3; i++) {
  //     const content = localStorage.getItem(`card${i}`);
  //     this.cards[i - 1].content = content || "";
  //   }
  // }

  // addInput(cardIndex: number) {
  //   this.cards[cardIndex].inputs.push({ value: "" });
  // }

  // updateCardContent(cardIndex: number, inputIndex: number, event: any) {
  //   const inputValue = (event.target as HTMLInputElement).value;

  //   if (inputValue.trim() === "") {
  //     this.cards[cardIndex].inputs.splice(inputIndex, 1);
  //   } else {
  //     this.cards[cardIndex].content += inputValue + "\n";
  //     this.cards[cardIndex].inputs.splice(inputIndex, 1);
  //   }
  // }
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthentificationService
  ) {}

  openModal(content: any): NgbModalRef {
    return this.modalService.open(content, { centered: true });
  }
  onCatasks(id: any): void {
    this.http
      .post("http://localhost:5000/projet/getByID", {
        projetId: id,
      })
      .subscribe(
        (response: any) => {
          console.log(response.projet.cat_Tasks);
          this.projectTasks = response.projet.cat_Tasks;
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
        id: this.authService.getUserId(),
      })
      .subscribe(
        (response: any) => {
          console.log(response);
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
          this.onTasks(this.cat_TaskId);
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
          //this.onTasks(this.cat_TaskId);
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
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onCatDelete(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer cette tache?"
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
    const userData = {
      assigneID: this.userId,
      id: this.taskId,
    };
    const headers = this.authService.getHeaders();

    console.log("Membre", userData);

    this.http
      .post("http://localhost:5000/tache/update-task", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log("membre ajouter", response);
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
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
