import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatTableDataSource } from "@angular/material/table";
import { DataService } from "app/data.service";
import { AuthentificationService } from "app/authentification.service";
import { SocketService } from "app/socket.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-task-details",
  templateUrl: "./task-details.component.html",
  styleUrl: "./task-details.component.css",
})
export class TaskDetailsComponent {
  taskId: any;
  cat_taskId: any;
  allTasks: any;
  content: string;
  userId: any;
  projetId: any;
  membersUsers: any;
  allNotes: any;
  id: any;
  taskName: any;
  task: any;
  memberFormControl = new FormControl();
  filteredMembers: any[];
  memberSelected: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private authService: AuthentificationService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get("taskId");
    this.cat_taskId = this.route.snapshot.paramMap.get("cat_TaskId");
    this.projetId = this.route.snapshot.paramMap.get("projectId");
    this.onTasks(this.taskId);
    this.getMembers(this.projetId);
    this.onTask_note(this.taskId);
  }
  displayedColumns: string[] = ["nom", "prenom", "action"];
  dataSource = new MatTableDataSource<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onTasks(id: any): void {
    this.http
      .post("https://devcosit.com/tache/getTaskByID", {
        taskId: id,
      })
      .subscribe(
        (response: any) => {
          this.dataSource = response.task.members;
          this.task = response.task;
          this.taskName = response.task.title;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onTask_note(id: any): void {
    const headers = this.authService.getHeaders();
    this.http
      .post(
        "https://devcosit.com/tache/getTaskByID",
        {
          taskId: id,
        },
        { headers: headers }
      )
      .subscribe(
        (response: any) => {
          this.allNotes = response.task.notes;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  addNote(): void {
    const userData = {
      content: this.content,
      taskId: this.taskId,
      userId: this.authService.getUserId(),
    };
    const headers = this.authService.getHeaders();

    this.http
      .post("https://devcosit.com/tache/add-note", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.onTask_note(this.taskId);
          this.content = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }

  addMemberTask(): void {
    var nom = "";
    var prenom = "";
    for (let user of this.membersUsers) {
      if (this.memberSelected === user.userId) {
        nom = user.nom;
        prenom = user.prenom;
      }
    }

    const userData = {
      userId: this.memberSelected,
      nom: nom,
      prenom: prenom,
      taskId: this.taskId,
    };
    const headers = this.authService.getHeaders();
    const dataNotify = {
      userId: this.memberSelected,
      content: `La tâche "${
        this.taskName
      }" du projet : "${this.authService.getProjetName()}", vous a été assignée`,
      motif: "Tache",
    };
    console.log("avant lenvoie", dataNotify);

    this.http
      .post("https://devcosit.com/tache/add-member", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log("apres lenvoie", dataNotify);
          this.socket.sendNotify(dataNotify);
          this.onTasks(this.taskId);

          nom = "";
          prenom = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onChange = () => {
    this.membersUsers.forEach((ele: any) => {
      if (
        this.userId.split(" ")[0] === ele.prenom &&
        this.userId.split(" ")[1] === ele.nom
      ) {
        this.memberSelected = ele.userId;
      }
    });
  };

  getMembers(id: any): void {
    const headers = this.authService.getHeaders();
    this.http
      .post(
        "https://devcosit.com/projet/getByID",
        {
          projetId: id,
        },
        { headers: headers }
      )
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
  onDelete(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer ce membre?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "https://devcosit.com/tache/delete-member",
          {
            memberId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            this.onTasks(this.taskId);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  onRecup(id: any): void {
    const data = this.allNotes;
    for (let note of data) {
      if (note.id === id) {
        this.content = note.content;
        this.id = note.id;
      }
    }
  }

  onEditNote() {
    const userData = {
      content: this.content,
      id: this.id,
    };
    const headers = this.authService.getHeaders();
    this.http
      .post("https://devcosit.com/tache/update-note", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.onTask_note(this.taskId);
          this.content = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onDeleteNote(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer cette tache?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "https://devcosit.com/tache/delete-note",
          {
            noteId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            this.onTask_note(this.taskId);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  filterMembers(value: string) {
    this.filteredMembers = this.membersUsers.filter((member: any) =>
      (member.nom + " " + member.prenom)
        .toLowerCase()
        .includes(value.toLowerCase())
    );
  }
  displayFn(member: any): string {
    return member ? `${member.nom} ${member.prenom}` : "";
  }
  clean() {
    this.content = "";
  }
}
