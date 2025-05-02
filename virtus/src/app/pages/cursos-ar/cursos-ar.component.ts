import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {Observable} from "rxjs";
import {Course} from "../../models/Course";
import {FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, FormBuilder} from '@angular/forms';

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../../util/Utils";
import {Person} from "../../models/Person";
import {ConfirmationService} from "primeng/api";
import {LoginServicie} from "../loginServicie";


@Component({
  selector: 'app-cursos-ar',
  templateUrl: './cursos-ar.component.html',
  styleUrls: ['./cursos-ar.component.css']
})
export class CursosArComponent implements OnInit, AfterViewInit {

  newcourse_dialog: boolean;
  globalUri: string = "";
  course: Course;
  person: Person;
  courses: Course[];
  sortOrder: number;
  sortField: string;
  tmpFile: any;
  urlimageupload: string = "";
  idiomas: any [];
  loading: boolean = true;
  sortOptions: any[];

  infoCourseSelected: any = {};
  informationCourse: boolean;

  expandedRows: any = {};
  isExpanded: boolean = false;

  reegisterFormCourse: FormGroup;
  courseSuccessful = false;
  updateCourse = false;


  frmPhoto = new FormGroup({
    firstName: new FormControl()
  });

  constructor(
    private breadcrumbService: BreadcrumbService,
    private _http: HttpClient,
    private formBuilder: FormBuilder,
    private utils: Utils,
    private confirmationService: ConfirmationService,
    private loginservicie: LoginServicie) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app']},
      {label: 'Cursos Activos', routerLink: ['/app/coursear']}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.idiomas = [
      {label: "---:---", value: null},
      {label: "Español", value: "es"},
      {label: "English", value: "en"}
    ]
    this.sortOptions = [
      {label: 'Nombre curso A-Z', value: 'nameCourse'},
      {label: 'Nombre curso Z-A', value: '!nameCourse'},
      {label: 'Mas antiguos', value: 'dateregCourse'},
      {label: 'Ultimos agregados', value: '!dateregCourse'}
    ];
    this.utils.initPocket();
    this.loadCourse();
    this.reegisterFormCourse = this.formBuilder.group(
      {
        name: ["", Validators.required],
        description: ["", Validators.required],
        keywords: ["", Validators.required],
        language: ["", Validators.required]
      }
    );
  }

  selectedCourse(course: any) {
    this.newcourse_dialog = true;
    this.updateCourse = true;
    this.form["name"].setValue(course.nameCourse);
    this.form["description"].setValue(course.descriptionCourse);
    this.form["language"].setValue(course.languageCourse);
    this.form["keywords"].setValue(course.keywordsCourse);
    this.urlimageupload = course.pathimgCourse;
    this.person = new Person(course.personsIdPerson.id, "", "", "", "", "",
      "", "", "", "", "");
    this.course = new Course(
      course.id,
      this.form['name'].value,
      this.form['description'].value,
      this.form['keywords'].value,
      course.pathimgCourse, course.dateregCourse, course.dateupdateCourse,
      course.stateCourse, this.form['language'].value, "0.0"
    );
    this.course._personsIdPerson = this.person;
  }

  disabledCourses(course: any) {
    this.confirmationService.confirm({
      message: '¿Seguro que desea deshabilitar el curso?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        this.utils.loading;
        this.person = new Person(course.personsIdPerson.id, "", "", "", "", "",
          "", "", "", "", "");
        this.course = new Course(
          course.id,
          course.nameCourse,
          course.descriptionCourse,
          course.keywordsCourse,
          course.pathimgCourse, course.dateregCourse, course.dateupdateCourse,
          "I", course.languageCourse, "0.0"
        );
        this.course._personsIdPerson = this.person;
        this.apiUpdateCoruse(this.course).subscribe({
          next: response => {
            console.log(response);
            this.utils.showMessages(response.status, response.information, "tst");
            this.resetCourse();
            this.loadCourse();
            this.utils.closeLoading;
          }
        })
      },
      reject: () => {
      },
      key: "positionDialog"
    });
  }

  validateText(text: string) {
    if (text.length > 10) {

    }
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

  get form() {
    return this.reegisterFormCourse.controls;
  }

  loadCourse() {
    this.loading = true;
    this.apiLoadCourses().subscribe(response => {
      this.courses = response;
      console.log(this.courses);
      this.loading = false;
    });
  }

  apiLoadCourses(): Observable<Course[]> {
    // this.globalUri = this.utils.globalUrl + "course";
    this.globalUri = this.utils.globalUrl + "course/getcoursestatus?status_course=A";
    return this._http.get<Course[]>(this.globalUri, {});
  }

  saveCourse() {
    this.utils.loading;
    this.courseSuccessful = true;
    let urlPhoto: string = "";

    if (this.reegisterFormCourse.invalid) {
      return;
    }

    if (this.updateCourse) {
      if (this.tmpFile === undefined) {
        this.course._nameCourse = this.form['name'].value;
        this.course._descriptionCourse = this.form['description'].value;
        this.course._languageCourse = this.form['language'].value;
        this.course._keywordsCourse = this.form['keywords'].value;
        this.apiUpdateCoruse(this.course).subscribe({
          next: response => {
            console.log(response);
            this.utils.showMessages(response.status, response.information, "tst");
            this.resetCourse();
            this.loadCourse();
            this.utils.closeLoading;
          }
        })
      } else {
        this.utils.changeImage(this.tmpFile).then(response => {
          urlPhoto = this.utils.makePathRecurso(response);
          this.course._pathimgCourse = urlPhoto;
          this.apiUpdateCoruse(this.course).subscribe(response => {
            console.log(response);
            this.utils.showMessages(response.status, response.information, "tst");
            this.resetCourse();
            this.loadCourse();
            this.utils.closeLoading;
          });
        });
      }
    } else {
      if (this.urlimageupload.length === 0) {
        this.utils.showMessages(3, "Ingrese una foto relacionada al curso.", "tst");
        this.utils.closeLoading;
        return;
      }

      this.utils.changeImage(this.tmpFile).then(response => {
        urlPhoto = this.utils.makePathRecurso(response);
        this.course = new Course(
          0,
          this.form['name'].value,
          this.form['description'].value,
          this.form['keywords'].value,
          urlPhoto, "", "",
          "", this.form['language'].value, "0.0"
        );
        this.apiSaveCoruse(this.course).subscribe(response => {
          console.log(response);
          this.utils.showMessages(response.status, response.information, "tst");
          this.resetCourse();
          this.loadCourse();
          this.utils.closeLoading;
        });
      });
    }
  }

  apiSaveCoruse(course: Course): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/insertcourse";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, course, {headers: headers});
  }

  apiUpdateCoruse(course: Course): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/updatecourse";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, course, {headers: headers});
  }

  resetCourse() {
    this.courseSuccessful = false;
    this.urlimageupload = "";
    this.reegisterFormCourse.reset();
    this.newcourse_dialog = false;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);

      var reader = new FileReader();
      //this.imagePath = files;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.urlimageupload = String(reader.result);
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


  openNew() {
    this.newcourse_dialog = true;
    this.reegisterFormCourse.reset();
    this.urlimageupload = "";
    this.updateCourse = false;
    this.urlimageupload = "";
    console.log(this.urlimageupload);
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
