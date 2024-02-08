import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Input,
} from "@angular/core";
import { TaskService } from "./services/task.service";
import { LinkService } from "./services/link.service";

import { gantt } from "dhtmlx-gantt";
import { HttpClient } from "@angular/common/http";
import { AuthentificationService } from "./authentification.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "gantt",
  styleUrls: ["./gantt.component.css"],
  providers: [TaskService, LinkService],
  template: `<div #gantt_here class="gantt-chart"></div>`,
})
export class GanttComponent implements OnInit, OnChanges {
  @ViewChild("gantt_here", { static: true }) ganttContainer!: ElementRef;
  @Input() projetInput: any;

  projet: any;
  projetId: any;

  constructor(
    // private taskService: TaskService,
    // private linkService: LinkService,
    private http: HttpClient,
    private authService: AuthentificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // gantt.config.project_start = new Date(2024, 2, 1);
    // gantt.config.project_end = new Date(2024, 2, 25);

    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.details_on_create = false;
    gantt.config.details_on_dblclick = false;
    gantt.config.drag_move = false;
    gantt.config.drag_progress = false;
    gantt.config.drag_resize = false;
    gantt.config.drag_links = false;

    gantt.config.fit_tasks = true;
    gantt.config.grid_elastic_columns = true;

    gantt.init(this.ganttContainer.nativeElement);
    gantt.clearAll();
    gantt.parse(this.formatGantt(this.projetInput));
    gantt.plugins({
      export_api: true,
    });

    // this.route.paramMap.subscribe((params) => {
    //   this.projetId = params.get("projetId");
    // });

    // this.getProject(this.projetId);
    // console.log(this.projet);

    // Promise.all([this.taskService.get(), this.linkService.get()]).then(
    //   ([data, links]) => {
    //     gantt.parse({ data, links });
    //   }
    // );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Détecter les changements dans les données d'entrée
    if (changes["projetData"]) {
      gantt.parse(this.formatGantt(this.projetInput));
    }
  }

  formatGantt(projetData: any) {
    let tasks = [
      {
        id: 1,
        text: projetData.title,
        start_date: projetData.date_deb,
        end_date: projetData.date_fin,
        parent: 0,
        open: true,
        progress: parseFloat(projetData.status) / 100,
      },
    ];

    let links = [{}];

    projetData.tasks.forEach((el: any) => {
      if (projetData.id === el.projetId) {
        tasks.push({
          id: el.id,
          text: el.title,
          start_date: el.dateCreate,
          end_date: el.deadline,
          parent: 1,
          open: false,
          progress: null,
        });
      }
      links.push({ id: el.id, source: 1, target: el.id, type: "1" });
    });

    return { tasks, links };
  }

  click() {
    this.router.navigate(["/table-list"]);
  }

  getProject(id: any) {
    const headers = this.authService.getHeaders();

    this.http
      .post(
        "https://devcosit.com/projet/getByID",
        { projetId: id },
        {
          headers: headers,
        }
      )
      .subscribe(
        (response: any) => {
          this.projet = response.projet;
          gantt.parse(this.formatGantt(this.projet));
          this.projet = "";
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
