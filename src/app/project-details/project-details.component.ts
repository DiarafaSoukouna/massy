import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "app/data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-project-details",
  templateUrl: "./project-details.component.html",
  styleUrl: "./project-details.component.css",
})
export class ProjectDetailsComponent implements OnInit {
  projetId: any;
  allprojet: any;
  oneProject: any;
  tasks: any;
  members: any;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.projetId = params.get("projetId");
    });
    this.getProject();

    console.log("hello000000", this.projetId);
  }
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}
  onProjet(id: any) {
    const data = this.allprojet;
    for (let datasource of data) {
      if (datasource.id === id) {
        this.oneProject = datasource;
        this.members = datasource.members;
        this.tasks = datasource.tasks.filter(
          (task: any) => task.status === true
        );
      }
    }
  }
  getProject() {
    this.dataService.getDonnees().subscribe((data: any) => {
      this.allprojet = data.projet;
      this.onProjet(this.projetId);
    });
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
}
