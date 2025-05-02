import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Utils} from "../../util/Utils";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Modules} from "../../models/Modules";
import {Topic} from "../../models/Topic";
import {Course} from "../../models/Course";
import {ConfirmationService} from "primeng/api";
import {LoginServicie} from "../loginServicie";


@Component({
  selector: 'app-topicar',
  templateUrl: './topicar.component.html',
  styleUrls: ['../../../assets/demo/badges.scss']
})
export class TopicarComponent implements OnInit, AfterViewInit {

  newTopicDialog: boolean;
  sortOrder: number;
  sortField: string;
  idCourse: string | null = "";
  idModule: string | null = "";
  globalUri: string = "";
  topic: Topic;
  topics: Topic[];
  urlimageupload: any;
  tmpFile: any;
  loadingDataCourse: boolean = true;
  dataCourse: any;
  dataModule: any;
  updateTopic: boolean = false;
  sortOptions: any[];

  registerFormTopic: FormGroup;
  topicSuccessful = false;

  frmPhoto = new FormGroup({
    firstName: new FormControl()
  });

  constructor(
    private breadcrumbService: BreadcrumbService,
    private _route: ActivatedRoute,
    private utils: Utils,
    private _http: HttpClient,
    private formBuilder: FormBuilder,
    private loginservicie: LoginServicie,
  private confirmationService: ConfirmationService) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.idModule = this._route.snapshot.paramMap.get("idmodule");
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/coursear/modulear/' + this.idCourse]},
      {label: 'Cursos', routerLink: ['/app/coursear']},
      {label: 'Módulos', routerLink: ['/app/coursear/modulear/' + this.idCourse]},
      {label: 'Temas', routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule]}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.loadTopics();
    this.loadDataCourse();
    this.loadDataModule();
    this.sortOptions = [
      {label: 'Nombre módulo A-Z', value: 'name_topic'},
      {label: 'Nombre módulo Z-A', value: '!name_topic'},
      {label: 'Mas antiguos', value: 'datereg_topic'},
      {label: 'Ultimos agregados', value: '!datereg_topic'}
    ];
    this.registerFormTopic = this.formBuilder.group(
      {
        name: ["", Validators.required],
        description: ["", Validators.required],
        keywords: ["", Validators.required]
      }
    );
  }

  selectedTopic(topic: any) {
    console.log(topic);
    this.updateTopic = true;
    this.newTopicDialog = true;
    this.form["name"].setValue(topic.name_topic);
    this.form["description"].setValue(topic.description_topic);
    this.form["keywords"].setValue(topic.keywords_topic);
    this.urlimageupload = topic.pathimg_topic;
    this.topic = new Topic(topic.id_topic,
      "", "", "",
      topic.pathimg_topic, topic.datereg_topic.replace(".0", ""), topic.dateupdate_topic.replace(".0", ""), topic.state_topic);
    let moduleAux = new Modules(
      parseInt(this.idModule === null ? "0" : this.idModule),
      "", "", "",
      "", "", "", ""
    )
    this.topic._syllabuIdSyllabu = moduleAux;
  }

  deleteTopic(topic: any) {
    this.confirmationService.confirm({
      message: '¿Seguro que desea deshabilitar el tema?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        this.utils.loading;
        this.topic = new Topic(topic.id_topic,
          topic.name_topic, topic.description_topic, topic.keywords_topic,
          topic.pathimg_topic, topic.datereg_topic.replace(".0", ""), topic.dateupdate_topic.replace(".0", ""), "I");
        let moduleAux = new Modules(
          parseInt(this.idModule === null ? "0" : this.idModule),
          "", "", "",
          "", "", "", ""
        )
        this.topic._syllabuIdSyllabu = moduleAux;
        console.log(this.topic);
        this.apiUpdateTopic(this.topic).subscribe({
          next: response => {
            console.log(response);
            this.utils.showMessages(response.status, response.information, "tst");
            this.resetTopic();
            this.loadTopics();
            this.utils.closeLoading;
          }
        })
      },
      reject: () => {
      },
      key: "positionDialog"
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

  apiGetDataModule(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "syllabu/getsyllabu";
    // @ts-ignore
    return this._http.post<any>(this.globalUri,
      {id_syllabu: this.idModule});
  }

  apiGetDataCourse(id: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/getCourseData";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", id);
    return this._http.get<any>(this.globalUri, {params: queryParams});
  }

  saveTopic() {
    this.utils.loading;
    this.topicSuccessful = true;
    let urlPhoto: string = "";

    if (this.registerFormTopic.invalid) {
      return;
    }

    if (this.updateTopic) {
      if (this.tmpFile === undefined) {
        this.topic.set_nameTopic(this.form["name"].value);
        this.topic.set_descriptionTopic(this.form["description"].value);
        this.topic.set_keywordsTopic(this.form["keywords"].value);
        this.apiUpdateTopic(this.topic).subscribe({
          next: response => {
            console.log(response);
            this.utils.showMessages(response.status, response.information, "tst");
            this.resetTopic();
            this.loadTopics();
            this.utils.closeLoading;
          }
        })
      } else {
        this.utils.changeImage(this.tmpFile).then(response => {
          urlPhoto = this.utils.makePathRecurso(response);
          this.topic.set_pathimgTopic(urlPhoto);
          this.topic.set_nameTopic(this.form["name"].value);
          this.topic.set_descriptionTopic(this.form["description"].value);
          this.topic.set_keywordsTopic(this.form["keywords"].value);
          this.apiSaveTopic(this.topic).subscribe(response => {
            this.utils.showMessages(response.status, response.information, "tst");
            this.resetTopic();
            this.loadTopics();
            this.utils.closeLoading;
          });
        });
      }
    } else {

      if (this.urlimageupload.length === 0) {
        this.utils.showMessages(3, "Ingrese una foto relacionada al tema.", "tst");
        this.utils.closeLoading;
        return;
      }

      this.utils.changeImage(this.tmpFile).then(response => {
        urlPhoto = this.utils.makePathRecurso(response);
        this.topic = new Topic(0,
          this.form['name'].value,
          this.form['description'].value,
          this.form['keywords'].value,
          urlPhoto, "", "", "");
        let moduleAux = new Modules(
          parseInt(this.idModule === null ? "0" : this.idModule),
          "", "", "",
          "", "", "", ""
        )
        this.topic._syllabuIdSyllabu = moduleAux;
        this.apiSaveTopic(this.topic).subscribe(response => {
          this.utils.showMessages(response.status, response.information, "tst");
          this.resetTopic();
          this.loadTopics();
          this.utils.closeLoading;
        });
      });
    }
  }

  apiSaveTopic(topic: Topic): Observable<any> {
    this.globalUri = this.utils.globalUrl + "topic/inserttopic";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, topic, {headers: headers});
  }

  apiUpdateTopic(topic: Topic): Observable<any> {
    this.globalUri = this.utils.globalUrl + "topic/updatetopic";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, topic, {headers: headers});
  }

  resetTopic() {
    this.registerFormTopic.reset();
    this.newTopicDialog = false;
  }

  loadTopics() {
    this.apiLoadTopics().subscribe(response => {
      console.log(response);
      this.topics = response.data;
    });
  }

  apiLoadTopics(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "topic/gettopics";
    console.log(this.globalUri);
    return this._http.post<any>(this.globalUri,
      {syllabu_id_topic: this.idModule});
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

  get form() {
    return this.registerFormTopic.controls;
  }

  openNew() {
    this.newTopicDialog = true;
    this.updateTopic = false;
    this.urlimageupload = "";
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);

      var reader = new FileReader();
      //this.imagePath = files;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.urlimageupload = reader.result;
      }

      const objectURL = URL.createObjectURL(file);
      this.urlimageupload = objectURL;
      console.log(objectURL)
      this.tmpFile = file;
      this.frmPhoto.patchValue({
        field: file
      });
    }
  }



}
