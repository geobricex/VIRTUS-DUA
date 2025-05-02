import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../app.breadcrumb.service';
import {Course} from "../../models/Course";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../../util/Utils";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {error} from "protractor";
import {LoginServicie} from "../loginServicie";

@Component({
  selector: 'app-miscursos',
  templateUrl: './miscursos.component.html',
  styleUrls: ['./miscursos.component.scss']
})
export class MiscursosComponent implements OnInit, AfterViewInit {

  courses: Course[];

  sortOrder: number;
  sortField: string;
  globalUri: string = "";
  infoCourseSelected: any = {};
  informationCourse: boolean;
  loading: boolean = true;
  sortOptions: any[];
  statusApi: number = 0;

  expandedRows: any = {};
  isExpanded: boolean = false;

  constructor(private breadcrumbService: BreadcrumbService, private utils: Utils, private _http: HttpClient,
              public router: Router, private loginservicie: LoginServicie) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app']},
      {label: 'Cursos', routerLink: ['/app/course']},
      {label: 'Mis cursos', routerLink: ['/app/mycourse']}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.loadMyCourse();
    this.sortOptions = [
      {label: 'Nombre curso A-Z', value: 'name_course'},
      {label: 'Nombre curso Z-A', value: '!name_course'},
      {label: 'Mas antiguos', value: 'datereg_course'},
      {label: 'Ultimos agregados', value: '!datereg_course'}
    ];
  }

  expandAll() {
    if (!this.isExpanded) {
      let module: any = {};
      this.infoCourseSelected.syllabus_.forEach((module: { id_course: string | number; }) => this.expandedRows[module.id_course] = true);

    } else {
      this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  saberMas(idCourse: any) {
    console.log(idCourse)
    this.apiSaberMas(idCourse)
      .subscribe(response => {
        console.log(response);
        this.infoCourseSelected = response.data[0];
        console.log(this.infoCourseSelected);
        this.informationCourse = true;
      });
  }

  apiSaberMas(idCourse: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/selectcoursesyllabutopic";
    return this._http.post(this.globalUri, {id_course: idCourse});
  }

  loadMyCourse() {
    this.loading = true;
    this.apiLoadMyCourse()
      .subscribe(
        {
          next: response => {
            console.log(response);
            this.statusApi = response.status;
            if (response.status === 2) {
              this.courses = response.data;
            }
            this.loading = false;
          }
          , error: err => {
            console.log(err);
            console.log("Error interno de servidor");
          }
        });
  }

  apiLoadMyCourse(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "personscours/mycoursejoin";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, {state_course_person: "A"}, {headers: headers});
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

}
