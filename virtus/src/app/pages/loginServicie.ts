import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import {Observable} from "rxjs";
import {Person} from "../models/Person";
import {PersonInterface} from "../models/PersonInterface";
import {Utils} from "../util/Utils";

@Injectable({
  providedIn: "root"
})

export class LoginServicie {

  globalUri: string = "";

  constructor(private _http: HttpClient, private cookies: CookieService, private utils: Utils) { }

  apiLogin(email: string, password: string): Observable<any> {

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      this.globalUri = "virtus_bk/persons/login";
    } else {
      this.globalUri = "virtusbk/persons/login";
    }

    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native');
    return this._http.post(this.globalUri, {
      "email": email,
      "password": password
    }, {'headers': headers});
  }

  getDataPerson(token: string): Observable<PersonInterface>{

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      this.globalUri = "virtus_bk/persons/getperson";
    } else {
      this.globalUri = "virtusbk/persons/getperson";
    }

    return this._http.post<PersonInterface>(this.globalUri, {
      "sessionToken": token,
    });

  }

  setToken(token: string) {
    this.utils.token = token;
    this.cookies.set("token", token);
  }
  getToken() {
    return this.cookies.get("token");
  }

  deleteToken () {
    sessionStorage.clear();
    this.cookies.delete("token", "");
  }


}
