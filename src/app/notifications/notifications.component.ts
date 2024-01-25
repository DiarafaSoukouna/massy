import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AuthentificationService } from "app/authentification.service";
import { SocketService } from "app/socket.service";
declare var $: any;
@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  notifies: any;

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService,
    private socket: SocketService
  ) {}
  showNotification(from, align) {
    const type = ["", "info", "success", "warning", "danger"];

    const color = Math.floor(Math.random() * 4 + 1);

    $.notify(
      {
        icon: "notifications",
        message:
          "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer.",
      },
      {
        type: type[color],
        timer: 4000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
  ngOnInit() {
    this.getAllNotify(this.authService.getUserId());
    this.socket.getNotify().subscribe((response: any) => {
      this.getAllNotify(this.authService.getUserId());
    });
  }
  getAllNotify(id: string) {
    this.http
      .post("https://devcosit.com/user/getNotifyBy-user", { userId: id })
      .subscribe((response: any) => {
        this.notifies = response.notify.sort((a: any, b: any) => {
          if (a.dateCreate < b.dateCreate) {
            return 1;
          }
          return -1;
        });
      });
  }
  onDelete(id: any): void {
    const userConfirmed = window.confirm(
      "Etes-vous sur de vouloir supprimer cette notification?"
    );

    const headers = this.authService.getHeaders();
    if (userConfirmed) {
      this.http
        .post(
          "https://devcosit.com/user/delete-notify",
          {
            notifyId: id,
          },
          { headers: headers }
        )
        .subscribe(
          (response: any) => {
            this.getAllNotify(this.authService.getUserId());
            this.socket.getNotify().subscribe((response: any) => {
              this.getAllNotify(this.authService.getUserId());
            });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
