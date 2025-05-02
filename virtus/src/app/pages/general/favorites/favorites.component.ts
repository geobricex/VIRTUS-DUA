import {AfterViewInit, Component, OnInit} from '@angular/core';

import {BreadcrumbService} from '../../../app.breadcrumb.service';
import {Course} from "../../../models/Course";

import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../../../util/Utils";
import {Person} from "../../../models/Person";
import {ConfirmationService} from "primeng/api";
import {Router} from "@angular/router";
import {LoginServicie} from "../../loginServicie";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, AfterViewInit {

  courses: Course[];
  sortOrder: number;
  sortField: string;
  globalUri: string = "";
  informationCourse: boolean;
  infoCourseSelected: any = {};

  expandedRows: any = {};
  isExpanded: boolean = false;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private utils: Utils,
    private _http: HttpClient,
    private confirmationService: ConfirmationService,
    public router: Router,
    private loginservicie: LoginServicie) {
    this.breadcrumbService.setItems([
      {label: 'Cursos', routerLink: ['app/course']},
      {label: 'Favoritos', routerLink: ['/app/course/favorites']}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.loadCoruse();
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
    this.apiSaberMas(idCourse).subscribe(response => {
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

  loadCoruse() {
    this.apiLoadCourses().subscribe(response => {
      this.courses = response.data;
      console.log(this.courses);
    });
  }

  joinCourse(idCourse: any) {
    this.confirmationService.confirm({
      key: 'confirmJoin',
      message: 'Esta seguro de ingresar a este curso ?',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        console.log(idCourse);
        this.apiJoinCourse(idCourse).subscribe(response => {
          console.log(response);
          this.utils.showMessages(response.status, response.information, "tst");
          this.loadCoruse();
          this.router.navigateByUrl('/app/mycourse');
        });
      },
      reject: () => {

      }
    });
  }

  apiJoinCourse(idCourse: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "personscours/joincourse";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, {id_course: idCourse}, {headers: headers});
  }

  apiLoadCourses(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "personscours/allcoursenojoin";
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
