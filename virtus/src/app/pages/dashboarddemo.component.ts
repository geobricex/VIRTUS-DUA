import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../app.breadcrumb.service';
import {Person} from "../models/Person";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Session} from "../models/session";
import {StorageService} from "../authentication/StorageService";
import {Utils} from "../util/Utils";
import {LoginServicie} from "./loginServicie";
import {any} from "codelyzer/util/function";
import {Router} from "@angular/router";
import {AppComponent} from "../app.component";

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardDemoComponent implements OnInit, AfterViewInit {

  globalUri: string = "";
  homedata: any = [];
  statusApi: number = 0;
  responseData: any;

  constructor(
    public router: Router,
    private breadcrumbService: BreadcrumbService,
    private _http: HttpClient,
    private storageService: StorageService,
    private utils: Utils,
    private loginservicie: LoginServicie
  ) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app']},
      {label: 'Inicio', routerLink: ['/app']}
    ]);
  }

  ngOnInit() {
    console.log("ngOnInit Home");
    this.utils.closeLoading;
    this.homedata = [];
    this.statusApi = 0;
    this.responseData = null;
    this.loginservicie.getDataPerson(this.loginservicie.getToken()).subscribe({
        next: response => {
          this.responseData = response;
        }, error: err => {
          console.log(err)
          this.homedata = [];
          location.reload();//No debería

        }, complete: () => {
          this.apiInformationHome(this.responseData.typePerson).subscribe({
            next: response => {
              console.log(response);
              this.statusApi = response.status;
              this.homedata = response.data[0];
            }, error: err => {
              console.log(err);
              this.homedata = [];
              location.reload();//No debería
              // this.router.navigateByUrl('/login');

            }, complete: () => {
            }
          })
        }
      }
    );

  }

  ngAfterViewInit() {
    //console.clear();
  }

  apiInformationHome(typePerson: string): Observable<any> {
    this.globalUri = this.utils.globalUrl + "utils/gethomeinformation";
    console.log(this.globalUri)
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, {
      "id_type": typePerson === "A" || typePerson === "R" ? 2 : 1,
    }, {'headers': headers});
  }

}
