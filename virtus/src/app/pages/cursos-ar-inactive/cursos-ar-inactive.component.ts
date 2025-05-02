import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Course} from "../../models/Course";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../../util/Utils";
import {Observable} from "rxjs";
import {Person} from "../../models/Person";
import {ConfirmationService} from "primeng/api";
import {LoginServicie} from "../loginServicie";

@Component({
  selector: 'app-cursos-ar-inactive',
  templateUrl: './cursos-ar-inactive.component.html',
  styleUrls: ['./cursos-ar-inactive.component.scss']
})
export class CursosArInactiveComponent implements OnInit, AfterViewInit {

  newcourse_dialog: boolean;
  globalUri: string = "";
  course: Course;
  courses: Course[];
  sortOrder: number;
  sortField: string;
  tmpFile: any;
  urlimageupload: any;
  idiomas: any [];
  person: Person;
  sortOptions: any[];

  infoCourseSelected: any = {};
  informationCourse: boolean;

  expandedRows: any = {};
  isExpanded: boolean = false;

  reegisterFormCourse: FormGroup;
  courseSuccessful = false;

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
      {label: 'Cursos Inactivos', routerLink: ['/app/courseinactivear']}
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
    ];
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


  onSortChange(event: any) {
    let value = event.value;
    console.log(value);
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
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

  enableCourse(course: any) {
    this.confirmationService.confirm({
      message: '¿Seguro que desea habilitar el curso?',
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
          "A", course.languageCourse, "0.0"
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

  apiSaberMas(idCourse: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "course/selectcoursesyllabutopic";
    return this._http.post(this.globalUri, {id_course: idCourse});
  }

  get form() {
    return this.reegisterFormCourse.controls;
  }

  loadCourse() {
    this.apiLoadCourses().subscribe(response => {
      this.courses = response;
      console.log(this.courses);
    });
  }

  apiLoadCourses(): Observable<Course[]> {
    this.globalUri = this.utils.globalUrl + "course/getcoursestatus?status_course=I";
    return this._http.get<Course[]>(this.globalUri, {});
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


  openNew() {
    this.newcourse_dialog = true;
  }

}
