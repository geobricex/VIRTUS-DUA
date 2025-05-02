import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Utils} from "../../util/Utils";

import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Person} from "../../models/Person";

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit, AfterViewInit {

  email: string | null = "";
  code: string | null = "";
  vericateAccount: boolean;
  globalUri: string = "";

  constructor(
    private _route: ActivatedRoute,
    private utils: Utils,
    private _http: HttpClient
  ) {

  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.vericateAccount = false;
    this.email = this._route.snapshot.paramMap.get("email");
    this.code = this._route.snapshot.paramMap.get("code");
    console.log(this.email, this.code);
    this.apiRequestCode().subscribe(response => {
      this.utils.showMessages(response.status, response.information, "tst");
      if (response.status === 2) {
        this.vericateAccount = true;
      }
    });
  }

  apiRequestCode(): Observable<any> {
    // if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    //   this.globalUri = "virtus_bk/persons/requestcode";
    // } else {
    //   // this.globalUri = "virtusbk/persons/signup";
    //   this.globalUri = "virtusbk/persons/requestcode";
    // }

    this.globalUri = this.utils.globalUrl + "persons/requestcode";

    return this._http.post<Person>(this.globalUri, {
      "flag": "1",
      "email": this.email,
      "code": this.code
    });
  }
}
