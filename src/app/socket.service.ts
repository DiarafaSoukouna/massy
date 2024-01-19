import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io } from "socket.io-client";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: any;
  userNotify: any[];

  constructor(private http: HttpClient) {
    this.socket = io("http://localhost:5000");
  }

  // Add methods to interact with Socket.IO events
  sendSocket(message: any): void {
    this.socket.emit("send message", message);
  }

  getSocket() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on("emit message", (message: any) => {
          observer.next(message);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  getNotify() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on("emit notify", (message: any) => {
          observer.next(message);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  sendNotify(dataNotify: any): void {
    this.http
      .post("http://localhost:5000/user/add-notify", dataNotify)
      .subscribe(
        (response: any) => {
          this.socket.emit("send notify", "notify");
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
