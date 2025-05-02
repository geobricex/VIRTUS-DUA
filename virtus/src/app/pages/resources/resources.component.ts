import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {ActivatedRoute} from "@angular/router";
import {Utils} from "../../util/Utils";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Resources} from "../../models/Resources";
import {Evaluation} from "../../models/Evaluation";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {Topic} from "../../models/Topic";
import {LoginServicie} from "../loginServicie";

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit, AfterViewInit {

  resource: Resources;
  evaluation: Evaluation;
  idCourse: string | null = "";
  idModule: string | null = "";
  idTopic: string | null = "";
  globalUri: string | null = "";
  resourcesData: any [];
  evaluationData: any [];
  tmpFile: any;
  videoUrl: any;
  viewVideoDialog: boolean;
  tituloTopic: string;
  descriptionTopic: string;
  vieweRemoteUrl: boolean;
  urlSafe: any;

  statusResources: number = 0;
  statusEvaluations: number = 0;

  newResourseDialog: boolean;
  registerFormEvaluation: FormGroup;
  registerFormResources: FormGroup;
  typeFileGlobal: string;
  viewPdf: boolean;
  pdfUrl: any;
  typeEvalutionform: any[];

  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private _route: ActivatedRoute,
    private utils: Utils,
    private _http: HttpClient,
    public sanitizer: DomSanitizer,
    private loginservicie: LoginServicie
  ) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.idModule = this._route.snapshot.paramMap.get("idmodule");
    this.idTopic = this._route.snapshot.paramMap.get("idTopic");
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule]},
      {label: 'Cursos', routerLink: ['/app/course']},
      {label: 'Mis cursos', routerLink: ['/app/mycourse']},
      {label: 'Módulos', routerLink: ['/app/mycourse/modules/' + this.idCourse]},
      {label: 'Temas', routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule]},
      {
        label: 'Recursos y evaluaciones',
        routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule + '/resources/' + this.idTopic]
      }
    ]);
  }

  ngAfterViewInit() {
    // console.clear();
  }

  ngOnInit(): void {
    this.utils.initPocket();
    this.typeEvalutionform = [
      {label: "---:---", value: null},
      {label: "Evaluación", value: 1},
      {label: "Cuestionario", value: 2},
    ]
    this.loadResources();
    this.loadEvaluations();
    this.enteredResources();
  }

  viewUrlRemot(remoteUrl: any) {
    this.vieweRemoteUrl = true;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(remoteUrl);
  }

  viewFile(url: string) {
    console.log(url);
    if (url.includes(".pdf")) {
      this.pdfUrl = url;
      this.viewPdf = true;
    }
  }

  viewVideo(url: string) {
    this.videoUrl = url;
    this.viewVideoDialog = true;
  }


  topicData(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "topic/gettopic";
    console.log("ID DEL TOPIC: " + this.idTopic);
    return this._http.post(this.globalUri,
      {"id_topic": parseInt(typeof this.idTopic === "string" ? this.idTopic : "0")}
      ,);
  }


  get form() {
    return this.registerFormEvaluation.controls;
  }

  get formR() {
    return this.registerFormResources.controls;
  }

  loadResources() {
    console.log("this.idTopic = " + this.idTopic);
    this.apiLoadResources().subscribe({
      next: response => {
        console.log("DATA");
        console.log(response);
        this.statusResources = response.status;
        if (response.status === 2)
          this.resourcesData = response.data;
      }, error: err => {

      }
    })
  }

  loadEvaluations() {
    this.apiLoadEvaluations().subscribe({
      next: response => {
        console.log(response);
        this.statusEvaluations = response.status;
        this.evaluationData = response.data;
      }, error: err => {

      }
    });
  }

  apiLoadResources(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "resource/getresources";
    return this._http.post<any>(this.globalUri, {topic_id_resources: this.idTopic});
  }

  apiLoadEvaluations(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "evaluation/getevaluations";
    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, {topic_id_evaluation: this.idTopic}, {headers: headers});

  }

  enteredResources() {
    this.topicData().subscribe(response => {
      console.log(response);
      this.tituloTopic = response.data[0].name_topic;
      this.descriptionTopic = response.data[0].description_topic;
    });
  }
}
