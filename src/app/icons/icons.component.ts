import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { DataService } from "app/data.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AuthentificationService } from "app/authentification.service";
import { SocketService } from "app/socket.service";

@Component({
  selector: "app-icons",
  templateUrl: "./icons.component.html",
  styleUrls: ["./icons.component.css"],
})
export class IconsComponent implements OnInit {
  @ViewChild("scrollContainer") scrollContainer: ElementRef;

  users: any;
  chatId: any;
  userChats: any;
  userIdSub: any;
  userOnline: any;
  content: any;
  curChat: any;
  messages: any[];
  conUser: any = this.authService.getUserId();
  lastMessage: any;
  allMessages: any[];
  searchTerm: any;
  filtered: any;
  search: any;
  userFiltered: any;
  messageClicked: boolean = false;
  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthentificationService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    this.getUser();
    this.chatId = this.route.snapshot.paramMap.get("chatId");
    this.socket.getSocket().subscribe((socket) => {
      this.getCurrentChat(this.chatId);
      this.getUsersChat(this.authService.getUserId());
    });
    this.getUsersChat(this.authService.getUserId());
    this.getCurrentChat(this.chatId);

    this.onRecup(this.authService.getUserId());
  }
  getUser() {
    this.dataService.getUsers().subscribe(
      (data: any) => {
        if (Array.isArray(data.user)) {
          this.users = data.user;
          this.onRecup(this.authService.getUserId());
          this.filter();
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
    // console.log("les data", userData);

    this.http
      .post("https://devcosit.com/chat/add-chat", userData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          this.onClickChat(response.chat.id);
          this.curChat = response.chat;
          this.getCurrentChat(response.chat.id);
          this.onRecup(this.authService.getUserId());
          this.getUsersChat(this.authService.getUserId());
          this.getUser();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getInitials(nom: string, prenom: string): string {
    return nom.charAt(0).toUpperCase() + prenom.charAt(0).toUpperCase();
  }
  onClickChat(id: any): void {
    this.chatId = id;
    this.router.navigate(["/chat", { chatId: id }]);
    this.getCurrentChat(id);
  }

  getUsersChat(id: any): void {
    this.http
      .post("https://devcosit.com/chat/getChatBy-user", {
        userId: id,
      })
      .subscribe(
        (response: any) => {
          this.userChats = response.chat.sort((a: any, b: any) => {
            if (a.dateUpdate < b.dateUpdate) {
              return 1;
            }
            return -1;
          });

          this.filte();
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
    if (this.content) {
      this.http
        .post("https://devcosit.com/chat/add-message", Data, {
          headers: headers,
        })
        .subscribe(
          (response: any) => {
            this.getCurrentChat(this.chatId);
            this.content = "";
            this.socket.sendSocket("chat");
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  getLastMessage(chat: any) {
    var boolView = false;
    const lastMessage = chat.messages.sort((a: any, b: any) => {
      if (a.dateCreate > b.dateCreate) {
        return 1;
      }
      return -1;
    });
    if (
      lastMessage.length > 0 &&
      lastMessage.slice(-1)[0].senderId !== this.authService.getUserId() &&
      lastMessage.slice(-1)[0].view === false
    ) {
      boolView = true;
    } else {
      boolView = false;
    }

    const con = chat.messages
      .sort((a: any, b: any) => {
        if (a.dateCreate > b.dateCreate) {
          return 1;
        }
        return -1;
      })
      .slice(-1)[0].content;

    return { content: con, view: boolView };
  }

  getLastMessageHours(chat: any) {
    const sortedMessages = chat.messages.sort((a: any, b: any) => {
      if (a.dateCreate > b.dateCreate) {
        return 1;
      }
      return -1;
    });

    const lastMessageDate = sortedMessages.slice(-1)[0].dateCreate;

    const messageDate = new Date(lastMessageDate);

    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  }

  applyFilter(event: Event) {
    //   filteredData = chatUserList.filter((elem) => {
    //     if (dataSearch === '' || !elem || dataSearch.length === 0) {
    //         return elem;
    //     } else {
    //         if (findWord(elem, dataSearch.toLowerCase())) {
    //             return elem;
    //         }
    //     }
    // })

    const filterValue = (event.target as HTMLInputElement).value;
    this.userChats.filter = filterValue.trim().toLowerCase();
  }
  filte() {
    if (this.searchTerm === undefined || this.searchTerm.trim() === "") {
      this.filtered = this.userChats;
      return;
    }

    this.filtered = this.userChats.filter((message: any) => {
      let fullName = "";
      if (message.userId === this.authService.getUserId()) {
        fullName = message.nomSub + " " + message.prenomSub;
      } else {
        fullName = message.nom + " " + message.prenom;
      }

      const includesResult = fullName
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return includesResult;
    });
  }

  filter() {
    if (this.search === undefined || this.search.trim() === "") {
      this.userFiltered = this.users;
      return;
    }

    this.userFiltered = this.users.filter((message: any) => {
      const fullName = message.nom + " " + message.prenom;

      const includesResult = fullName
        .toLowerCase()
        .includes(this.search.toLowerCase());
      return includesResult;
    });
  }
  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
  dashboard() {
    this.router.navigate(["/dashboard"]);
  }
  UpdateMessage(chat: any): void {
    const chat1 = chat;
    for (let chat of chat1.messages) {
      if (
        chat.view === false &&
        chat.senderId !== this.authService.getUserId()
      ) {
        this.http
          .post("https://devcosit.com/chat/update-message", {
            id: chat.id,
            view: true,
          })
          .subscribe(
            (response: any) => {
              this.getUsersChat(this.authService.getUserId());
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }
}
