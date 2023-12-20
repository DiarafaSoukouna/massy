import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthentificationService {
  private apiUrl = "http://192.168.1.14:5000/auth/login";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { email, password });
  }
  // sendCode(){
  //   return this.http.post(`${this.apiUrl}`, { email });
  // }
  verifyCode(code: string) {
    return this.http.post(`${this.apiUrl}`, { code });
  }
}
