import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {Topic} from "../../models/Topic";
import {ActivatedRoute} from "@angular/router";
import {Utils} from "../../util/Utils";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['../../../assets/demo/badges.scss']
})
export class TemasComponent implements OnInit, AfterViewInit {

  temas: Topic[];
  sortOrder: number;
  sortField: string;
  idCourse: string | null = "";
  idModule: string | null = "";
  globalUri: string | null = "";
  loading: boolean = false;
  statusApi: number = 0;
  sortOptions: any[];
  dataCourse: any;
  dataModule: any;
  loadingDataCourse: boolean = true;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private _route: ActivatedRoute,
    private utils: Utils,
    private _http: HttpClient) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.idModule = this._route.snapshot.paramMap.get("idmodule");
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/mycourse/modules/' + this.idCourse]},
      {label: 'Cursos', routerLink: ['/app/course']},
      {label: 'Mis cursos', routerLink: ['/app/mycourse']},
      {label: 'Módulos', routerLink: ['/app/mycourse/modules/' + this.idCourse]},
      {label: 'Temas', routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule]}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.loadDataCourse();
    this.loadDataModule();

    this.loadTopics();
    this.sortOptions = [
      {label: 'Nombre curso A-Z', value: 'name_topic'},
      {label: 'Nombre curso Z-A', value: '!name_topic'},
      {label: 'Mas antiguos', value: 'description_topic'},
      {label: 'Ultimos agregados', value: '!datereg_syllabu'}
    ];
  }

  loadTopics() {
    this.loading = true;
    this.apiLoadTopics().subscribe({
      next: response => {
        console.log(response);
        this.statusApi = response.status;
        if (response.status === 2)
          this.temas = response.data;
        this.loading = false;
      }, error: err => {
        console.log(err);
        console.log("Error interno de servidor");
      }
    });
  }

  loadDataCourse() {
    this.loadingDataCourse = true;
    this.apiGetDataCourse(this.idCourse).subscribe({
      next: response => {
        console.log(response);
        this.dataCourse = response;
        console.log(this.dataCourse);
      }
    })
  }

  loadDataModule() {
    this.apiGetDataModule().subscribe({
      next: response => {
        console.log(response);
        this.dataModule = response.data[0];
        this.loadingDataCourse = false;
      }
    })
  }

  apiLoadTopics(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "topic/gettopics";
    return this._http.post<any>(this.globalUri,
      {syllabu_id_topic: this.idModule});
  }

  apiGetDataCourse(id: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/getCourseData";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", id);
    return this._http.get<any>(this.globalUri, {params: queryParams});
  }

  apiGetDataModule(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "syllabu/getsyllabu";
    // @ts-ignore
    return this._http.post<any>(this.globalUri,
      {id_syllabu: this.idModule});
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
