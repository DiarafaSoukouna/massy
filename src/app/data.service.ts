import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private apiUrl = "http://localhost:5000/projet/getAll";
  private api = "http://localhost:5000/user/getAll";

  constructor(private http: HttpClient) {}

  getDonnees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
  Cat_Tasks(id: any): void {
    this.http.get<any[]>("http://localhost:5000/tache/getTaskBy-projet");
  }
}
