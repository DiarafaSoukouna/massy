import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private apiUrl = "http://192.168.1.14:5000/projet/getAll";
  private api = "http://192.168.1.14:5100/user/getAll";

  constructor(private http: HttpClient) {}

  getDonnees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
  getCat_Tasks(id: any): void {
    this.http.get<any[]>("http://192.168.1.14:5000/projet/getByID");
  }
}
