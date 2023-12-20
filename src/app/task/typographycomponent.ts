import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { DataService } from "app/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

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

  ngOnInit() {
    this.projetId = this.route.snapshot.paramMap.get("projetId");
    this.onCatasks(this.projetId);
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

  addCard() {
    const newTitle = prompt("Veuillez saisir le titre de la nouvelle carte:");

    if (newTitle) {
      const newIndex = this.cards.length + 1;
      this.cards.push({
        title: newTitle,
        content: "",
        inputs: [],
      });

      this.saveContent(newIndex - 1);
    } else {
      console.log(
        "L'ajout de la carte a été annulé car aucun titre n'a été saisi."
      );
    }
  }

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
    private route: ActivatedRoute
  ) {}

  openModal(content: any): NgbModalRef {
    return this.modalService.open(content, { centered: true });
  }
  onCatasks(id: any): void {
    this.http
      .post("http://192.168.1.14:5000/projet/getByID", {
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

  onSubmit(): void {
    const userData = {
      title: this.title,
      desc: this.desc,
      projetId: this.projetId,
      cat_TaskId: this.cat_TaskId,
    };

    this.http
      .post("http://192.168.1.14:5000/tache/add-task", userData)
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
