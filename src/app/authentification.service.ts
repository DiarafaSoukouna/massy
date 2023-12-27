import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthentificationService {
  localStorageKey: string = "access_token";
  private apiUrl = "http://localhost:5000/auth/login";
  userId: string = "id";
  userMail: any = "email";
  userPhone: any = "phone";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { email, password });
  }

  setToken(access_token: string) {
    localStorage.setItem("access_token", access_token);
  }
  getToken(): string {
    return localStorage.getItem("access_token");
  }
  removeToken(): void {
    localStorage.removeItem(this.localStorageKey);
  }

  setUserId(id: string) {
    localStorage.setItem(this.userId, id);
  }
  getUserId(): string {
    return localStorage.getItem(this.userId);
  }
  setUserMail(email: string) {
    localStorage.setItem("email", email);
  }
  getUserMail(): string {
    return localStorage.getItem("email");
  }
  setUserPhone(phone: string) {
    localStorage.setItem("phone", phone);
  }
  getUserPhone(): string {
    return localStorage.getItem("phone");
  }

  //  sendCode(){
  //    return this.http.post(`${this.apiUrl}`, { email });
  //  }
  verifyCode(code: string) {
    return this.http.post(`${this.apiUrl}`, { code });
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }
}
