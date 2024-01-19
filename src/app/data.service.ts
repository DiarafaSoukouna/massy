import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private apiUrl = "http://localhost:5000/projet/getAllProjet";
  private api = "http://localhost:5000/user/getAllUser";

  constructor(private http: HttpClient) {}

  getDonnees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
  getDatasets(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:5000/dataset/users-roles");
  }
  Cat_Tasks(id: any): void {
    this.http.get<any[]>("http://localhost:5000/tache/getTaskBy-projet");
  }
}
