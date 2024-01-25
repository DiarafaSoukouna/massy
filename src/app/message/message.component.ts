import { Component } from "@angular/core";
import { AuthentificationService } from "app/authentification.service";
import { DataService } from "app/data.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrl: "./message.component.css",
})
export class MessageComponent {
  users: any;
  chatId: any;
  userChats: any;
  userIdSub: any;
  userOnline: any;
  content: any;
  curChat: any;
  messages: any[];
  conUser: any = this.authService.getUserId();
  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthentificationService
  ) {}
  getUser() {
    this.dataService.getUsers().subscribe(
      (data: any) => {
        if (Array.isArray(data.user)) {
          this.users = data.user;
          this.onRecup(this.authService.getUserId());
        } else {
          console.error("Les données ne sont pas un tableau :", data);
        }
      },
      (error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des données :",
          error
        );
      }
    );
  }

  onRecup(id: any): void {
    const data = this.users;
    for (let use of data) {
      if (id === use.id) {
        this.userOnline = use;
      }
    }
  }

  initiateChat() {
    var nom = "";
    var prenom = "";
    var userId = "";
    var userIdSub = "";
    var nomSub = "";
    var prenomSub = "";

    for (let user of this.users) {
      if (this.authService.getUserId() === user.id) {
        nom = user.nom;
        prenom = user.prenom;
        userId = user.id;
      }
    }
    for (let userSub of this.users) {
      if (this.userIdSub === userSub.id) {
        nomSub = userSub.nom;
        prenomSub = userSub.prenom;
        userIdSub = userSub.id;
      }
    }

    const userData = {
      userId: userId,
      nom: nom,
      prenom: prenom,
      nomSub: nomSub,
      prenomSub: prenomSub,
      userIdSub: userIdSub,
    };
    const headers = this.authService.getHeaders();

    this.http
      .post("https://devcosit.com/chat/add-chat", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.onClickChat(response.chat.id);
          this.curChat = response.chat;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getRandomColor(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  getInitials(nom: string, prenom: string): string {
    return nom.charAt(0).toUpperCase() + prenom.charAt(0).toUpperCase();
  }
  onClickChat(id: any): void {
    this.router.navigate(["/chat", { chatId: id }]);
  }

  getUsersChat(id: any): void {
    this.http
      .post("https://devcosit.com/chat/getChatBy-user", {
        userId: id,
      })
      .subscribe(
        (response: any) => {
          this.userChats = response.chat;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getCurrentChat(id: any): void {
    this.http
      .post("https://devcosit.com/chat/getChatByID", {
        chatId: id,
      })
      .subscribe(
        (response: any) => {
          this.curChat = response.chat;
          this.messages = response.chat.messages.sort((a: any, b: any) => {
            if (a.dateCreate > b.dateCreate) {
              return 1;
            }
            return -1;
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  isSpecificUrl(): boolean {
    const currentUrl = this.route.snapshot.url.join("/");

    return currentUrl === "chat";
  }
  retourner() {
    this.router.navigate(["/chat"]);
  }
  onSendMessage(): void {
    const Data = {
      content: this.content,
      senderId: this.authService.getUserId(),
      chatId: this.chatId,
    };
    const headers = this.authService.getHeaders();
    this.http
      .post("https://devcosit.com/chat/add-message", Data, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.getCurrentChat(this.chatId);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
