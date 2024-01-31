import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { HttpClient } from "@angular/common/http";
import { SocketService } from "app/socket.service";
import { AuthentificationService } from "app/authentification.service";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "app/data.service";
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
declare var $: any;
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  email: any;
  notifies: any[];
  notView: any[];
  all: any[];
  userOnline: any;
  notif: any;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private http: HttpClient,
    private socket: SocketService,
    private authService: AuthentificationService,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });

    this.getAllNotify(this.authService.getUserId());
    this.socket.getNotify().subscribe((response: any) => {
      this.getAllNotify(this.authService.getUserId());
    });
    this.getUser();
    this.onRecup(this.authService.getUserId());
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
    // this.GetNotify();
  }

  // showNotification(from, align, notif) {
  //   const type = ["", "info", "success", "warning", "danger"];
  //   const color = Math.floor(Math.random() * 4 + 1);

  //   if (notif.userId === this.authService.getUserId()) {
  //     $.notify(
  //       {
  //         icon: "notifications",
  //         message: notif.content,
  //       },
  //       {
  //         type: type[color],
  //         timer: 4000,
  //         placement: {
  //           from: from,
  //           align: align,
  //         },
  //         template:
  //           '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
  //           '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
  //           '<i class="material-icons" data-notify="icon">notifications</i> ' +
  //           '<span data-notify="title">{1}</span> ' +
  //           '<span data-notify="message">{2}</span>' +
  //           '<div class="progress" data-notify="progressbar">' +
  //           '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
  //           "</div>" +
  //           '<a href="{3}" target="{4}" data-notify="url"></a>' +
  //           "</div>",
  //       }
  //     );
  //   }
  // }

  showNotification(notif: any): void {
    const type = ["info", "success", "warning", "danger"];
    const color = Math.floor(Math.random() * 4);

    if (notif.userId === this.authService.getUserId()) {
      const verticalPosition: MatSnackBarVerticalPosition = "top";

      const snackBarRef = this.snackBar.open(notif.content, "Fermer", {
        duration: 4000,
        panelClass: ["alert-" + type[color]],
        verticalPosition: "bottom",
      });

      snackBarRef.afterDismissed().subscribe(() => {});
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }
  profile() {
    this.router.navigate(["/profile"]);
  }
  chat() {
    this.router.navigate(["/chat"]);
  }

  getAllNotify(id: string) {
    const oldNotifyList = this.notif;
    this.http
      .post("https://devcosit.com/user/getNotifyBy-user", { userId: id })
      .subscribe((response: any) => {
        const newNotifyList = response.notify;

        this.notifies = response.notify
          .filter((notify: any) => notify.view === false)
          .sort((a: any, b: any) => {
            if (a.dateCreate < b.dateCreate) {
              return 1;
            }
            return -1;
          });
        this.notif = response.notify.sort((a: any, b: any) => {
          if (a.dateCreate < b.dateCreate) {
            return 1;
          }
          return -1;
        });

        if (newNotifyList.length > oldNotifyList.length) {
          const lastNotify = this.notif;
          this.showNotification(lastNotify[0]);
        }
      });

    this.notifies;
  }

  getNotify(id: string) {
    this.http
      .post("https://devcosit.com/user/getNotifyBy-user", { userId: id })
      .subscribe((response: any) => {
        this.notifies = response.notify
          .filter((notify: any) => notify.view === false)
          .sort((a: any, b: any) => {
            if (a.dateCreate < b.dateCreate) {
              return 1;
            }
            return -1;
          });
      });
  }

  onLogout() {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir vous deconnecter?"
    );
    if (userConfirmed) {
      this.http
        .post(
          "https://devcosit.com/auth/logout",
          {},
          { headers: this.authService.getHeaders() }
        )
        .subscribe((response: any) => {
          window.localStorage.removeItem("access_token");

          window.localStorage.removeItem("id");
          window.localStorage.removeItem("email");
          window.localStorage.removeItem("phone");
          window.localStorage.removeItem("projetId");

          this.router.navigate(["/login"]);
        });
    }
  }
  onClickNotify(id: any, content: any): void {
    this.http
      .post(
        "https://devcosit.com/user/update-notify",
        { id: id, view: true },
        { headers: this.authService.getHeaders() }
      )
      .subscribe((response: any) => {
        this.router.navigate(["/notifications"]);
        this.getNotify(this.authService.getUserId());
      });
  }
  getUser() {
    this.dataService.getUsers().subscribe((data: any) => {
      this.all = data.user;
      this.onRecup(this.authService.getUserId());
    });
  }
  onRecup(id: any): void {
    const data = this.all;
    for (let use of data) {
      if (id === use.id) {
        this.userOnline = use;
      }
    }
  }
  getInitials(nom: string, prenom: string): string {
    return nom.charAt(0).toUpperCase() + prenom.charAt(0).toUpperCase();
  }
}
