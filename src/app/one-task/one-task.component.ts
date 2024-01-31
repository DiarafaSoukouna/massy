import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthentificationService } from "app/authentification.service";

@Component({
  selector: "app-one-task",
  templateUrl: "./one-task.component.html",
  styleUrl: "./one-task.component.css",
})
export class OneTaskComponent {
  taskId: any;
  projetId: any;
  oneTask: any;
  members: any;
  notes: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthentificationService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get("taskId");

    this.getTask(this.taskId);
  }

  getTask(id: any) {
    const headers = this.authService.getHeaders();

    this.http
      .post(
        "https://devcosit.com/tache/getTaskByID",
        { taskId: id },
        {
          headers: headers,
        }
      )
      .subscribe(
        (response: any) => {
          this.oneTask = response.task;
          this.members = response.task.members;
          this.notes = response.task.notes;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onClickProject(id: any): void {
    this.router.navigate(["/task", { projetId: id }]);
  }
  onClickTaskMembers(id: any, cat_TaskId: any, projetId: any): void {
    this.router.navigate([
      "/task-details",
      { taskId: id, cat_TaskId: cat_TaskId, projectId: projetId },
    ]);
  }
  onClickTaskNotes(id: any, cat_TaskId: any): void {
    this.router.navigate([
      "/task-details",
      { taskId: id, cat_TaskId: cat_TaskId },
    ]);
  }
}
