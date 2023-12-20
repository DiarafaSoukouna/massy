import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

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
  movies = [
    "Episode I - The Phantom Menace",
    "Episode II - Attack of the Clones",
    "Episode III - Revenge of the Sith",
  ];

  ngOnInit() {
    this.cards.push({ title: "Taches a effectuer", content: "", inputs: [] });
    this.cards.push({ title: "Taches effectuee", content: "", inputs: [] });
    this.cards.push({ title: "Taches restantes", content: "", inputs: [] });
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
  constructor(private router: Router, private modalService: NgbModal) {}

  openModal(content: any): NgbModalRef {
    return this.modalService.open(content, { centered: true });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }
}
