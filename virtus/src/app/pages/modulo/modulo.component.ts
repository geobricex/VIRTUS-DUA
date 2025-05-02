import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {Modulo} from "../../models/modulo";
import {Observable} from "rxjs";
import {Utils} from "../../util/Utils";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Course} from "../../models/Course";

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['../../../assets/demo/badges.scss']
})
export class ModuloComponent implements OnInit, AfterViewInit {

  modules: Modulo[];
  sortOrder: number;
  sortField: string;
  globalUri: string = "";
  idCourse: string | null = "";
  statusApi: number = 0;
  loading: boolean = true;
  sortOptions: any [];
  dataCourse: any;
  loadingDataCourse: boolean = true;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private utils: Utils, private _http: HttpClient,
    private _route: ActivatedRoute
  ) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/mycourse']},
      {label: 'Cursos', routerLink: ['/app/course']},
      {label: 'Mis cursos', routerLink: ['/app/mycourse']},
      {label: 'Módulos', routerLink: ['/app/mycourse/modules']}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.loadModule();
    this.sortOptions = [
      {label: 'Nombre curso A-Z', value: 'name_syllabu'},
      {label: 'Nombre curso Z-A', value: '!name_syllabu'},
      {label: 'Mas antiguos', value: 'datereg_syllabu'},
      {label: 'Ultimos agregados', value: '!datereg_syllabu'}
    ];
    this.loadDataCourse();
  }

  loadDataCourse() {
    this.loadingDataCourse = true;
    this.apiGetDataCourse(this.idCourse).subscribe({
      next: response => {
        console.log(response);
        this.dataCourse = response;
        console.log(this.dataCourse);
        this.loadingDataCourse = false;
      }
    })
  }

  get getUtils() {
    return this.utils
  }

  loadModule() {
    this.loading = true;
    this.apiLoadModule().subscribe({
      next: response => {
        console.log(response);
        this.statusApi = response.status;
        if (response.status == 2)
          this.modules = response.data;
        console.log(this.modules);
        this.loading = false;
      },
      error: err => {
        console.log(err);
        console.log("Error interno de servidor");
      }
    });
  }

  apiLoadModule(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "syllabu/getsyllabus";
    return this._http.post<any>(this.globalUri,
      {course_id_syllabu: this.idCourse});
  }

  apiGetDataCourse(id: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/getCourseData";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", id);
    return this._http.get<any>(this.globalUri, {params: queryParams});
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
