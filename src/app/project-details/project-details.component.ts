import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "app/data.service";
import { Router } from "@angular/router";
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: "app-project-details",
  templateUrl: "./project-details.component.html",
  styleUrl: "./project-details.component.css",
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
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
  }

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {
    this.chartOptions = {
      series: [44],
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Team A"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }

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

  onRedirectMember(id: string) {
    this.router.navigate(["/membres", { projetId: id }]);
    this.onProjet(id);
  }

  onRedirectTask(id: string) {
    this.router.navigate(["/task", { projetId: id }]);
    this.onProjet(id);
  }
}
