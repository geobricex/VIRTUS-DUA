import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {ActivatedRoute} from "@angular/router";
import {Utils} from "../../util/Utils";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Evaluation} from "../../models/Evaluation";
import {Topic} from "../../models/Topic";
import {Resources} from "../../models/Resources";
import {DomSanitizer} from "@angular/platform-browser";
import {ConfirmationService, Message} from "primeng/api";
import {Modules} from "../../models/Modules";
import {Course} from "../../models/Course";
import {posix} from "path";
import {LoginServicie} from "../loginServicie";


@Component({
  selector: 'app-resourcesar',
  templateUrl: './resourcesar.component.html',
  styleUrls: ['./resourcesar.component.css']
})
export class ResourcesarComponent implements OnInit, AfterViewInit {
  checked: boolean = true;
  resource: Resources;
  evaluation: Evaluation;
  idCourse: string | null = "";
  idModule: string | null = "";
  idTopic: string | null = "";
  globalUri: string | null = "";
  resourcesData: any [];
  evaluationData: any [];
  tmpFile: any;
  tmpVideoSenia: any;
  tmpVideo: any;
  videoUrl: any;
  viewVideoDialog: boolean;
  tituloTopic: string;
  descriptionTopic: string;
  vieweRemoteUrl: boolean;
  urlSafe: any;

  newEvaluationsDialog: boolean;
  newResourseDialog: boolean;
  registerFormEvaluation: FormGroup;
  registerFormResources: FormGroup;
  courseSuccessful = false;
  tiempo: any [];
  typeFileGlobal: string;
  viewPdf: boolean;
  pdfUrl: any;
  typeEvalutionform: any[];
  msg: Message[] = [];

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
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    public confirmationService: ConfirmationService,
    private loginservicie: LoginServicie

  ) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.idModule = this._route.snapshot.paramMap.get("idmodule");
    this.idTopic = this._route.snapshot.paramMap.get("idTopic");
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule]},
      {label: 'Cursos', routerLink: ['/app/coursear']},
      {label: 'Módulos', routerLink: ['/app/coursear/modulear/' + this.idCourse]},
      {label: 'Temas', routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule]},
      {
        label: 'Recursos y evaluaciones',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/' + this.idTopic]
      }
    ]);
    this.registerFormEvaluation = this.formBuilder.group(
      {
        name: ["", Validators.required],
        description: ["", Validators.required],
        timeEvaluation: [false, Validators.required],
        timeminutesEvaluation: [0,],
        typeEvaluation: ["", Validators.required],
        opportunityEvaluation: [false, Validators.required],
        opportunitiesEvaluation: [0],
        orderByCategory: [true, Validators.required],
        allowsReview: [true, Validators.required]
      }
    );
    this.registerFormResources = this.formBuilder.group(
      {
        nameResources: ["", Validators.required],
        descriptionRes: ["", Validators.required],
        pathfileResource: [""],
        pathurlsignResource: [""],
        pathvideoResource: [""],
        pathurlremote_resource: [""]
      }
    );

  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.utils.initPocket();
    this.typeEvalutionform = [
      {label: "---:---", value: null},
      {label: "Evaluación", value: 1},
      {label: "Autoevaluación", value: 2},
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

  deleteEvaluation(evaluationforDelete: any) {

    this.confirmationService.confirm({
      message: '¿Seguro que desea deshabilitar la evaluación?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        this.utils.loading;
        console.log(evaluationforDelete);

        const datereg_eva = new Date(evaluationforDelete.datereg_evaluation).toISOString().replace('Z', '');
        const dateupdate_eva = new Date(evaluationforDelete.dateupdate_evaluation).toISOString().replace('Z', '');
        //id: number, nameEvaluation: string, descriptionEvaluation: string, dateregEvaluation: string,
        //dateupdateEvaluation: string, timeEvaluation: string, timeminutesEvaluation: number,
        //numberquestionEvaluation: number, state_evaluation: string, typeEvaluation: string,
        //opportunityEvaluation: boolean, opportunitiesEvaluation: number, orderCategory: boolean, allowsReview: boolean
        console.log(datereg_eva + " " + dateupdate_eva);

        this.evaluation = new Evaluation(
          evaluationforDelete.id_evaluation,
          evaluationforDelete.name_evaluation,
          evaluationforDelete.description_evaluation,
          evaluationforDelete.datereg_evaluation,
          evaluationforDelete.dateupdate_evaluation,
          evaluationforDelete.time_evaluation,
          evaluationforDelete.timeminutes_evaluation,
          evaluationforDelete.numberquestion_evaluation,
          evaluationforDelete.state_evaluation,
          evaluationforDelete.type_evaluation,
          evaluationforDelete.opportunity_evaluation,
          evaluationforDelete.opportunities_evaluation,
          evaluationforDelete.order_category,
          evaluationforDelete.allows_review
        );

        let topicAux: Topic;
        topicAux = new Topic(
          parseInt(this.idTopic === null ? "0" : this.idTopic),
          "", "", "", "",
          "", "", "")
        this.evaluation._topicsIdTopic = topicAux;

        console.log(this.evaluation);
        this.apiDeleteEvaluation(this.evaluation).subscribe(response => {
          this.utils.showMessages(response.status, response.information, "tst");
          this.loadEvaluations();
          this.utils.closeLoading;
        });
      },
      reject: () => {

      },
      key: "positionDialog"
    });

  }

  deleteResource(resourceforDelete: any) {

    this.confirmationService.confirm({
      message: '¿Seguro que desea deshabilitar el recuerso?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        this.utils.loading;
        console.log(resourceforDelete)

        const datereg_resource = new Date(resourceforDelete.datereg_resource).toISOString().replace('Z', '');
        const dateupdate_resource = new Date(resourceforDelete.dateupdate_resource).toISOString().replace('Z', '');

        this.resource = new Resources(
          resourceforDelete.id_resource,
          resourceforDelete.name_resource,
          resourceforDelete.description_resource,
          resourceforDelete.pathfile_resource,
          resourceforDelete.pathfile_resource,
          resourceforDelete.pathurlsign_resource,
          resourceforDelete.pathurlremote_resource,
          datereg_resource,
          dateupdate_resource,
          resourceforDelete.state_resource,
        );

        let topicAux: Topic;
        topicAux = new Topic(
          parseInt(this.idTopic === null ? "0" : this.idTopic),
          "", "", "", "",
          "", "", "")
        this.resource._topicsIdTopic = topicAux;

        console.log(this.resource);
        this.apiDeleteResources(this.resource).subscribe(response => {
          this.utils.showMessages(response.status, response.information, "tst");
          this.loadResources();
          this.utils.closeLoading;
        });
      },
      reject: () => {

      },
      key: "positionDialog"
    });
  }

  apiDeleteEvaluation(evaluationforDelete: Evaluation): Observable<any> {
    this.globalUri = this.utils.globalUrl + "evaluation/deleteevaluation";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, evaluationforDelete, {headers: headers});
  }

  apiDeleteResources(resourceforDelete: Resources): Observable<any> {
    this.globalUri = this.utils.globalUrl + "resource/delateresource";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, resourceforDelete, {headers: headers});
  }

  saveResources() {
    this.utils.loading;

    this.resource = new Resources(
      0,
      this.formR['nameResources'].value, this.formR["descriptionRes"].value,
      "", "", "", this.formR["pathurlremote_resource"].value,
      "", "", "");
    let topicAux: Topic;
    topicAux = new Topic(
      parseInt(this.idTopic === null ? "0" : this.idTopic),
      "", "", "", "",
      "", "", "")
    this.resource._topicsIdTopic = topicAux;

    if (this.formR["pathfileResource"].value === "" && this.formR["pathurlsignResource"].value === "" &&
      this.formR["pathvideoResource"].value === "") {
      console.log(this.resource);
      this.apiSaveResources().subscribe(response => {
        this.utils.showMessages(response.status, response.information, "tst");
        this.loadResources();
        this.resetResources();
        this.utils.closeLoading;
      });
    }

    if (this.formR["pathfileResource"].value !== "" && this.formR["pathurlsignResource"].value === "" &&
      this.formR["pathvideoResource"].value === "") {
      this.utils.changeImage(this.tmpFile).then(response => {
        this.formR["pathfileResource"].setValue(this.utils.makePathRecurso(response));
        this.resource._pathfileResource = this.formR["pathfileResource"].value;
        console.log(this.resource);
        this.apiSaveResources().subscribe(response => {
          this.utils.showMessages(response.status, response.information, "tst");
          this.loadResources();
          this.resetResources();
          this.utils.closeLoading;
        });
      });
    }

    if (this.formR["pathfileResource"].value === "" && this.formR["pathurlsignResource"].value !== "" &&
      this.formR["pathvideoResource"].value === "") {
      this.utils.changeImage(this.tmpVideoSenia).then(response => {
        this.formR["pathurlsignResource"].setValue(this.utils.makePathRecurso(response));
        this.resource._pathurlsignResource = this.formR["pathurlsignResource"].value;
        console.log(this.resource);
        this.apiSaveResources().subscribe(response => {
          this.utils.showMessages(response.status, response.information, "tst");
          this.loadResources();
          this.resetResources();
          this.utils.closeLoading;
        });
      });
    }

    if (this.formR["pathfileResource"].value === "" && this.formR["pathurlsignResource"].value === "" &&
      this.formR["pathvideoResource"].value !== "") {
      this.utils.changeImage(this.tmpVideo).then(response => {
        this.formR["pathvideoResource"].setValue(this.utils.makePathRecurso(response));
        this.resource._pathvideoResource = this.formR["pathvideoResource"].value;
        console.log(this.resource);
        this.apiSaveResources().subscribe(response => {
          this.utils.showMessages(response.status, response.information, "tst");
          this.loadResources();
          this.resetResources();
          this.utils.closeLoading;
        });
      });
    }

    if (this.formR["pathfileResource"].value !== "" && this.formR["pathurlsignResource"].value !== "" &&
      this.formR["pathvideoResource"].value === "") {
      this.utils.changeImage(this.tmpFile).then(response => {
        this.formR["pathfileResource"].setValue(this.utils.makePathRecurso(response));
        this.resource._pathfileResource = this.formR["pathfileResource"].value;
        this.utils.changeImage(this.tmpVideoSenia).then(response => {
          this.formR["pathurlsignResource"].setValue(this.utils.makePathRecurso(response));
          this.resource._pathurlsignResource = this.formR["pathurlsignResource"].value;
          console.log(this.resource);
          this.apiSaveResources().subscribe(response => {
            this.utils.showMessages(response.status, response.information, "tst");
            this.loadResources();
            this.resetResources();
            this.utils.closeLoading;
          });
        });
      });
    }

    if (this.formR["pathfileResource"].value !== "" && this.formR["pathurlsignResource"].value === "" &&
      this.formR["pathvideoResource"].value !== "") {
      this.utils.changeImage(this.tmpFile).then(response => {
        this.formR["pathfileResource"].setValue(this.utils.makePathRecurso(response));
        this.resource._pathfileResource = this.formR["pathfileResource"].value;
        this.utils.changeImage(this.tmpVideo).then(response => {
          this.formR["pathvideoResource"].setValue(this.utils.makePathRecurso(response));
          this.resource._pathvideoResource = this.formR["pathvideoResource"].value;
          console.log(this.resource);
          this.apiSaveResources().subscribe(response => {
            this.utils.showMessages(response.status, response.information, "tst");
            this.loadResources();
            this.resetResources();
            this.utils.closeLoading;
          });
        });
      });
    }

    if (this.formR["pathfileResource"].value === "" && this.formR["pathurlsignResource"].value !== "" &&
      this.formR["pathvideoResource"].value !== "") {
      this.utils.changeImage(this.tmpVideoSenia).then(response => {
        this.formR["pathurlsignResource"].setValue(this.utils.makePathRecurso(response));
        this.resource._pathurlsignResource = this.formR["pathurlsignResource"].value;
        this.utils.changeImage(this.tmpVideo).then(response => {
          this.formR["pathvideoResource"].setValue(this.utils.makePathRecurso(response));
          this.resource._pathvideoResource = this.formR["pathvideoResource"].value;
          console.log(this.resource);
          this.apiSaveResources().subscribe(response => {
            this.utils.showMessages(response.status, response.information, "tst");
            this.loadResources();
            this.resetResources();
            this.utils.closeLoading;
          });
        });
      });
    }

    if (this.formR["pathfileResource"].value !== "" && this.formR["pathurlsignResource"].value !== "" &&
      this.formR["pathvideoResource"].value !== "") {
      this.utils.changeImage(this.tmpFile).then(response => {
        this.formR["pathfileResource"].setValue(this.utils.makePathRecurso(response));
        this.resource._pathfileResource = this.formR["pathfileResource"].value;
        this.utils.changeImage(this.tmpVideoSenia).then(response => {
          this.formR["pathurlsignResource"].setValue(this.utils.makePathRecurso(response));
          this.resource._pathurlsignResource = this.formR["pathurlsignResource"].value;
          this.utils.changeImage(this.tmpVideo).then(response => {
            this.formR["pathvideoResource"].setValue(this.utils.makePathRecurso(response));
            this.resource._pathvideoResource = this.formR["pathvideoResource"].value;
            console.log(this.resource);
            this.apiSaveResources().subscribe(response => {
              this.utils.showMessages(response.status, response.information, "tst");
              this.loadResources();
              this.resetResources();
              this.utils.closeLoading;
            });
          });
        });
      });
    }
  }

  enteredResources() {
    this.topicData().subscribe(response => {
      console.log(response);
      this.tituloTopic = response.data[0].name_topic;
      this.descriptionTopic = response.data[0].description_topic;
    });
  }

  apiSaveResources(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "resource/insertresource";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, this.resource, {headers: headers});
  }

  topicData(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "topic/gettopic";
    console.log("ID DEL TOPIC: " + this.idTopic);
    return this._http.post(this.globalUri,
      {"id_topic": parseInt(typeof this.idTopic === "string" ? this.idTopic : "0")}
      ,);
  }

  resetResources() {
    this.newResourseDialog = false;
    this.registerFormResources.reset();
    this.formR["pathfileResource"].setValue("");
    this.formR["pathvideoResource"].setValue("");
    this.formR["pathurlsignResource"].setValue("");
    this.formR["pathurlremote_resource"].setValue("");
  }

  onUploadFile(event: any) {
    this.msg.push({severity: 'info', summary: 'Virtus', detail: 'Procesando...'});
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      console.log(file.type);
      if (file.type === "application/pdf" || file.type === "application/x-zip-compressed" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.tmpFile = file;
        this.formR["pathfileResource"].setValue(file.name);
        this.utils.showMessages(2, "Archivo: " + file.name + " cargado exitosamente.", "tst");
      } else {
        this.formR["pathfileResource"].setValue("");
        this.utils.showMessages(1, "Formato de archivo no permitido.", "tst");
      }
      this.msg = [];
    }
  }

  onUploadVideoSenia(event: any) {
    this.msg.push({severity: 'info', summary: 'Virtus', detail: 'Procesando...'});
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      if (file.type === "video/mp4" || file.type === "video/mp3") {
        this.tmpVideoSenia = file
        this.formR["pathurlsignResource"].setValue(file.name);
        this.utils.showMessages(2, "Archivo: " + file.name + " cargado exitosamente.", "tst");
      } else {
        this.formR["pathurlsignResource"].setValue("");
        this.utils.showMessages(1, "Formato de archivo no permitido.", "tst");
      }
    }
    this.msg = [];
  }

  onUploadVideo(event: any) {
    this.msg.push({severity: 'info', summary: 'Virtus', detail: 'Procesando...'});
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.formR["pathvideoResource"].setValue(file.name);
      if (file.type === "video/mp4" || file.type === "video/mp3") {
        this.tmpVideo = file
        this.formR["pathvideoResource"].setValue(file.name);
        this.utils.showMessages(2, "Archivo: " + file.name + " cargado exitosamente.", "tst");
      } else {
        this.formR["pathvideoResource"].setValue("");
        this.utils.showMessages(1, "Formato de archivo no permitido.", "tst");
      }
    }
    this.msg = [];
  }

  saveEvaluation() {
    this.utils.loading;

    if (!this.form['timeEvaluation'].value) {
      this.form['timeminutesEvaluation'].setValue(0);
    }
    //
    // console.log(this.form['name'].value);
    // console.log(this.form['description'].value);
    // console.log(this.form['timeEvaluation'].value);
    // console.log(this.form['timeminutesEvaluation'].value);
    // console.log(this.form['orderByCategory'].value);

    this.evaluation = new Evaluation(
      0,
      this.form['name'].value,
      this.form['description'].value,
      "", "",
      this.form['timeEvaluation'].value,
      this.form['timeEvaluation'].value ? this.form['timeminutesEvaluation'].value : 0,
      0,
      "",
      this.form['typeEvaluation'].value,
      this.form['opportunityEvaluation'].value,
      this.form['opportunityEvaluation'].value ? this.form['opportunitiesEvaluation'].value : 1,
      this.form['orderByCategory'].value, this.form['allowsReview'].value
    )
    let topicAux: Topic;
    topicAux = new Topic(
      parseInt(this.idTopic === null ? "0" : this.idTopic),
      "", "", "", "",
      "", "", "")
    this.evaluation._topicsIdTopic = topicAux;
    console.log(this.evaluation)
    // console.log(this.evaluation._topicsIdTopic)
    this.apiSaveEvaluation().subscribe(response => {
      console.log(response);
      this.utils.showMessages(response.status, response.information, "tst");
      this.loadEvaluations();
      this.resetEvaluation();
      this.registerFormResources.reset();
      this.utils.closeLoading;
    });
  }

  apiSaveEvaluation(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "evaluation/insertevaluation";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, this.evaluation, {headers: headers});
  }

  resetEvaluation() {
    this.registerFormEvaluation.reset();
    this.newEvaluationsDialog = false;
  }

  get form() {
    return this.registerFormEvaluation.controls;
  }

  get formR() {
    return this.registerFormResources.controls;
  }

  loadResources() {
    console.log(this.idTopic);
    this.apiLoadResources().subscribe(response => {
      console.log(response);
      this.resourcesData = response.data;
    })
  }

  loadEvaluations() {
    this.apiLoadEvaluations().subscribe(response => {
      console.log(response);
      this.evaluationData = response.data;
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

}
