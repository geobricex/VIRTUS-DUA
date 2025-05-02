import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Utils} from "../../util/Utils";
import {Observable} from "rxjs";
import {Course} from "../../models/Course";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Modules} from "../../models/Modules";
import {Person} from "../../models/Person";
import {ConfirmationService} from "primeng/api";
import {LoginServicie} from "../loginServicie";


@Component({
  selector: 'app-moduloar',
  templateUrl: './moduloar.component.html',
  styleUrls: ['../../../assets/demo/badges.scss']
})
export class ModuloarComponent implements OnInit, AfterViewInit {

  module: Modules;
  modules: Modules[];
  sortOrder: number;
  sortField: string;
  newModuleDialog: boolean;
  globalUri: string = "";
  idCourse: string | null = "";
  urlimageupload: any;
  tmpFile: any;
  loading: boolean = true;
  loadingDataCourse: boolean = true;
  dataCourse: any;
  updateModule: boolean = false;
  sortOptions: any[];

  registerFormModule: FormGroup;
  moduleSuccessful = false;

  frmPhoto = new FormGroup({
    firstName: new FormControl()
  });

  constructor(
    private breadcrumbService: BreadcrumbService,
    private utils: Utils,
    private _http: HttpClient,
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private loginservicie: LoginServicie
  ) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.breadcrumbService.setItems([
      {label: 'Cursos', routerLink: ['/app/coursear']},
      {label: 'Módulos', routerLink: ['/app/coursear/modulear/' + this.idCourse]}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.utils.initPocket();
    this.loadCourse();
    this.registerFormModule = this.formBuilder.group(
      {
        name: ["", Validators.required],
        description: ["", Validators.required],
        keywords: ["", Validators.required]
      }
    );
    this.sortOptions = [
      {label: 'Nombre módulo A-Z', value: 'name_syllabu'},
      {label: 'Nombre módulo Z-A', value: '!name_syllabu'},
      {label: 'Mas antiguos', value: 'datereg_syllabu'},
      {label: 'Ultimos agregados', value: '!datereg_syllabu'}
    ];
    this.loadDataCourse();
  }

  selectedModule(module: any) {
    this.updateModule = true;
    this.newModuleDialog = true;
    this.form["name"].setValue(module.name_syllabu);
    this.form["description"].setValue(module.description_syllabu);
    this.form["keywords"].setValue(module.keywords_syllabu);
    this.urlimageupload = module.pathimg_syllabus

    this.module = new Modules(
      module.id_syllabu,
      this.form['name'].value,
      this.form['description'].value,
      this.form['keywords'].value,
      this.urlimageupload, module.datereg_syllabu.toString().replaceAll(".0", ""),
      module.dateupdate_syllabu.toString().replaceAll(".0", ""), module.state_syllabu);
    let courseAux = new Course(parseInt(this.idCourse === null ? "0" : this.idCourse),
      "", "", "", "",
      "", "", "", "", "");
    this.module._coursesIdCourse = courseAux;

  }

  deleteModule(module: any) {
    this.confirmationService.confirm({
      message: '¿Seguro que desea deshabilitar el curso?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        this.utils.loading;
        this.module = new Modules(
          module.id_syllabu,
          module.name_syllabu,
          module.description_syllabu,
          module.keywords_syllabu,
          module.pathimg_syllabus, module.datereg_syllabu.toString().replaceAll(".0", ""),
          module.dateupdate_syllabu.toString().replaceAll(".0", ""), "I");
        let courseAux = new Course(parseInt(this.idCourse === null ? "0" : this.idCourse),
          "", "", "", "",
          "", "", "", "", "");
        this.module._coursesIdCourse = courseAux;
        console.log(this.module);
        this.apiUpdateModule(this.module).subscribe({
          next: response => {
            this.utils.showMessages(response.status, response.information, "tst");
            this.loadCourse();
            this.resetModule();
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
        this.loadingDataCourse = false;
      }
    })
  }

  apiGetDataCourse(id: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/getCourseData";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", id);
    return this._http.get<any>(this.globalUri, {params: queryParams});
  }

  saveModule() {
    this.utils.loading;
    this.moduleSuccessful = true;
    let urlPhoto: string = "";

    if (this.registerFormModule.invalid) {
      return;
    }

    if (this.updateModule) {
      if (this.tmpFile === undefined) {
        this.module._nameSyllabu = this.form['name'].value;
        this.module._descriptionSyllabu = this.form['description'].value;
        this.module._keywordsSyllabu = this.form['keywords'].value;
        console.log(this.module);
        this.apiUpdateModule(this.module).subscribe({
          next: response => {
            this.utils.showMessages(response.status, response.information, "tst");
            this.loadCourse();
            this.resetModule();
            this.utils.closeLoading;
            this.updateModule = false;
          }
        })
      } else {
        this.utils.changeImage(this.tmpFile).then(response => {
          urlPhoto = this.utils.makePathRecurso(response);
          this.module._pathimgSyllabus = urlPhoto;
          console.log(this.module)
          this.apiUpdateModule(this.module).subscribe(response => {
            this.utils.showMessages(response.status, response.information, "tst");
            this.loadCourse();
            this.resetModule();
            this.utils.closeLoading;
            this.updateModule = false;
          });
        });
      }
    } else {

      if (this.urlimageupload.toString().length === 0) {
        this.utils.showMessages(3, "Ingrese una foto relacionada al modulo.", "tst");
        this.utils.closeLoading;
        return;
      }

      this.utils.changeImage(this.tmpFile).then(response => {
        urlPhoto = this.utils.makePathRecurso(response);
        this.module = new Modules(
          0,
          this.form['name'].value,
          this.form['description'].value,
          this.form['keywords'].value,
          urlPhoto, "", "", ""
        )
        let courseAux = new Course(parseInt(this.idCourse === null ? "0" : this.idCourse),
          "", "", "", "",
          "", "", "", "", "");
        this.module._coursesIdCourse = courseAux;
        console.log(this.module)
        this.apiSaveCourse(this.module).subscribe(response => {
          this.utils.showMessages(response.status, response.information, "tst");
          this.loadCourse();
          this.resetModule();
          this.utils.closeLoading;
          this.updateModule = false;
        });
      });
    }
  }

  resetModule() {
    this.newModuleDialog = false;
    this.moduleSuccessful = false;
    this.registerFormModule.reset();
  }

  openNew() {
    this.newModuleDialog = true;
    this.registerFormModule.reset();
    this.updateModule = false;
    this.urlimageupload = "";
  }

  loadCourse() {
    this.loading = true;
    this.apiLoadCourses().subscribe(response => {
      console.log(response);
      this.modules = response.data;
      this.loading = false;
    });
  }

  apiLoadCourses(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "syllabu/getsyllabus";
    return this._http.post<any>(this.globalUri,
      {course_id_syllabu: this.idCourse});
  }

  apiSaveCourse(module: Modules): Observable<any> {
    this.globalUri = this.utils.globalUrl + "syllabu/insertsyllabu";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, module, {headers: headers});
  }

  apiUpdateModule(module: Modules): Observable<any> {
    this.globalUri = this.utils.globalUrl + "syllabu/updatesyllabu";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, module, {headers: headers});
  }

  get form() {
    return this.registerFormModule.controls;
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
