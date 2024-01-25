import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private apiUrl = "https://devcosit.com/projet/getAllProjet";
  private api = "https://devcosit.com/user/getAllUser";

  constructor(private http: HttpClient) {}

  getDonnees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
  getDatasets(): Observable<any[]> {
    return this.http.get<any[]>("https://devcosit.com/dataset/users-roles");
  }
  Cat_Tasks(id: any): void {
    this.http.get<any[]>("https://devcosit.com/tache/getTaskBy-projet");
  }
}
