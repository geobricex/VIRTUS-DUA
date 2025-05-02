import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {
  Answers, AnswersModel,
  EvaluationModel,
  QuestionCategory,
  Questions,
  QuestionsModel
} from "../../models/evaluation_questionarie";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {type} from "os";
import {Utils} from "../../util/Utils";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Message} from "primeng/api";
import { Location } from '@angular/common';
import {LoginServicie} from "../loginServicie";

@Component({
  selector: 'app-question-nu',
  templateUrl: './question-nu.component.html',
  styleUrls: ['./question-nu.component.scss']
})
export class QuestionNuComponent implements OnInit, AfterViewInit {

  idCourse: string | null = "";
  idModule: string | null = "";
  idTopic: string | null = "";
  idEvaluation: string | null = "";
  typeQuestion: number;
  levelQuestion: number = 1;
  textComplete: string | null;
  idQuestion: number = 0;

  literales: any [];

  registerFormQuestion: FormGroup;

  public objectQuestion = {} as QuestionsModel;
  public objetctEvaluation = {} as EvaluationModel;
  public objectQuestionCategory = {} as QuestionCategory;

  public objectAnswer = {} as AnswersModel;
  cant_piezas: any [];

  valRadio: string;
  options: any [];

  tmpFileRes: any;
  tmpFileQuest: any;
  globalUri: string = "";

  frmPhoto = new FormGroup({
    firstName: new FormControl()
  });
  urlimageupload: any;
  tmpFile: any;

  msgs: Message[] = [];

  // ESTRUCTURA PARA LAS RESPUESTAS DE LAS PREGUNTAS
  structure: any [];
  tmpfiles: any [];

  updateQuestion: boolean = false;
  viewFile: boolean = false;
  urlImg: string = "";

  format_text: any []; // variable para armar el texto para completar la palabra
  types_text: any [];
  text_entered: string = "";
  type_selected: string = "";
  file_completed: any[];
  url_file_completed: string = "";

  constructor(
    private _route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private formBuilder: FormBuilder,
    private utils: Utils,
    private _http: HttpClient,
    private location: Location,
    private loginservicie: LoginServicie
  ) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.idModule = this._route.snapshot.paramMap.get("idmodule");
    this.idTopic = this._route.snapshot.paramMap.get("idTopic");
    this.idEvaluation = this._route.snapshot.paramMap.get("idResource");
    let type: string | null = this._route.snapshot.paramMap.get("type");
    this.typeQuestion = parseInt(type !== null ? type : "0");
    console.log("tipo de pregunta ", this.typeQuestion);
    let idquestion: string | null = this._route.snapshot.paramMap.get("idquestion");
    this.idQuestion = parseInt(idquestion !== null ? idquestion : "0");

    if (this.idQuestion !== 0) {
      // buscar la esrtuctura de la pretunta por el id
      this.updateQuestion = true;
      this.apiGetDataQuestion().subscribe({
        next: response => {
          console.log(response);
          this.form["title_question"].setValue(response.data[0].title_question);
          this.form["description_question"].setValue(response.data[0].description_question);
          this.form["feedback_question"].setValue(response.data[0].feedback_question);
          this.form["hint_question"].setValue(response.data[0].hint_question);
          this.form["level_question"].setValue(response.data[0].level_question);
          this.form["points_question"].setValue(response.data[0].points_question);
          this.form["maximumpoints_question"].setValue(response.data[0].maximumpoints_question);
          this.form["pathurlfile_question"].setValue(response.data[0].pathurlfile_question);
          this.form["pathurlsign_question"].setValue(response.data[0].pathurlsign_question);
          this.form["pathurlvideo_question"].setValue(response.data[0].pathurlvideo_question);
          this.structure = response.data[0].options_answer
          // objeto question
          this.objectQuestion.id = response.data[0].id_question;
          this.objectQuestion.stateQuestion = response.data[0].state_question;
          this.objetctEvaluation.id = response.data[0].evaluations_id_evaluation;
          this.objectQuestion.evaluationsIdEvaluation = this.objetctEvaluation;
          this.objectQuestionCategory.id = response.data[0].question_category_id_questioncategory
          this.objectQuestion.questionCategoryIdQuestionCategory = this.objectQuestionCategory;
          // objeto responses
          this.objectAnswer.id = response.data[0].id_answer;
          this.objectAnswer.dateregAnswer = response.data[0].datereg_answer;
          this.objectAnswer.dateupdateAnswer = response.data[0].dateupdate_answer;
          this.objectAnswer.optionsAnswer = JSON.stringify(this.structure);
          this.objectAnswer.questionsIdQuestion = this.objectQuestion;
          console.log(this.structure);

          if (this.typeQuestion === 2 || this.typeQuestion === 3) {
            for (let i = 0; i < this.structure.length; i++) {
              this.tmpfiles.push({tmp: {}});
            }
          } else if (this.typeQuestion === 4) {

          } else if (this.typeQuestion === 5) {
            for (let i = 0; i < this.structure.length; i++) {
              this.tmpfiles.push({tmpright: {}}, {tmpleft: {}});
            }
          } else if (this.typeQuestion === 6) {
            this.urlimageupload = this.structure[0].resource;
          }

        }
      })
    }

    this.breadcrumbService.setItems([
      {
        label: '',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/' + this.idTopic + '/update_evaluation/' + this.idEvaluation]
      },
      {label: 'Cursos', routerLink: ['/app/coursear']},
      {label: 'Módulos', routerLink: ['/app/coursear/modulear/' + this.idCourse]},
      {label: 'Temas', routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule]},
      {
        label: 'Recursos y evaluaciones',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/' + this.idTopic]
      },
      {
        label: 'Edicion de cuestionarios/evaluaciones',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/' + this.idTopic + '/updatequecust/' + this.idEvaluation]
      },
      {
        label: 'Pregunta',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/'
        + this.idTopic + '/updatequecust/' + this.idEvaluation + '/question_nu/' + this.typeQuestion]
      }
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.utils.initPocket();
    this.registerFormQuestion = this.formBuilder.group(
      {
        title_question: ["", Validators.required],
        description_question: ["", Validators.required],
        feedback_question: [""],
        hint_question: [""],
        level_question: [1],
        points_question: [false],
        maximumpoints_question: [0],
        pathurlfile_question: [""],
        pathurlsign_question: [""],
        pathurlvideo_question: [""]
      }
    );
    this.options = [
      {label: "---:---", value: null},
      {label: "Respuesta correcta", value: "Yes"},
      {label: "Respuesta incorrecta", value: "No"}
    ];
    this.literales = ["A", "B", "C", "D", "E", "F"];
    this.cant_piezas = [
      {label: "---:---", value: null},
      {label: "4", value: 4},
      {label: "9", value: 9},
      {label: "16", value: 16},
      {label: "25", value: 25},
      {label: "36", value: 36},
      {label: "49", value: 49},
      {label: "64", value: 64}
    ];
    this.types_text = [
      {label: "Texto natural", value: "TN"},
      {label: "Opcion correcta", value: "OC"},
      {label: "Distractor", value: "D"},
    ];
    this.format_text = [];
    this.validateAnswer(this.typeQuestion);
  }

  addText() {

    if (this.text_entered === "") {
      this.utils.showMessages(3, "Por favor ingrese al menos una palabra.", "tst");
      return;
    }

    // if(this.type_selected !== 'TN') {
    //   if(this.file_completed === undefined || this.file_completed.length === 0) {
    //     this.utils.showMessages(3, "Por favor seleccione al menos una imagen para la opción correcta ingresado.", "tst");
    //     return;
    //   }
    // }

    if (this.type_selected !== 'D') {
      this.format_text.push(
        {
          text: this.text_entered,
          type: this.type_selected,
          urlFileUpload: this.url_file_completed,
          style: this.type_selected === 'OC' ? 'color: white; background: green; padding: 3px; border-radius: 5px; font-weight: bold;' : 'black'
        }
      );
      console.log(this.format_text);
    } else {
      this.utils.showMessages(3, "Seleccione el tipo de texto diferente a distractor para agregar.", "tst");
    }
    this.text_entered = "";
    this.validarEstructura();
    this.file_completed = [];
    this.url_file_completed = "";
  }

  addDistractor() {

    if (this.format_text.length <= 0) {
      this.utils.showMessages(3, "Por favor agrege al menos un texto natural u opcion correcta.", "tst");
      return;
    }

    if (this.text_entered === "") {
      this.utils.showMessages(3, "Por favor ingrese al menos una palabra.", "tst");
      return;
    }

    // if(this.type_selected !== 'TN') {
    //   if(this.file_completed === undefined || this.file_completed.length === 0) {
    //     this.utils.showMessages(3, "Por favor seleccione al menos una imagen para el distractor ingresado.", "tst");
    //     return;
    //   }
    // }

    if (this.type_selected === 'D') {
      this.format_text.push(
        {text: this.text_entered, type: this.type_selected, style: 'black', urlFileUpload: this.url_file_completed,}
      );
    } else {
      this.utils.showMessages(3, "Seleccione el tipo distractor para agregarlo.", "tst");
    }

    this.text_entered = "";
    this.validarEstructura();
    this.file_completed = [];
    this.url_file_completed = "";
  }

  eliminarItem(index: number) {
    this.format_text.splice(index, 1);
    this.validarEstructura();
  }

  validarEstructura() {
    let description: string = "";
    let description_R: string = "";
    let optionsx = [];
    this.structure.length = 0;
    for (let i = 0; i < this.format_text.length; i++) {

      if (i > 0 && i < this.format_text.length) {
        description += " ";
        description_R += " ";
      }

      if (this.format_text[i].type !== 'D') {
        description += this.format_text[i].type === 'OC' ? '{$option$}' : this.format_text[i].text;
        description_R += this.format_text[i].text;
      }

      if (this.format_text[i].type !== 'TN') {
        optionsx.push({
          "option": this.format_text[i].text,
          "resource": this.format_text[i].urlFileUpload
        })
      }
    }
    console.log(description);
    console.log(description_R);
    console.log(optionsx);
    this.structure.push({
      description_question: description,
      description_question_R: description_R,
      options: optionsx
    });
    console.log(this.structure);
  }

  openViewFile(url: string) {
    console.log(url);
    this.urlImg = url;
    this.viewFile = true;
  }

  apiGetDataQuestion(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "question/getQuestion";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, {
      id_question: this.idQuestion
    }, {headers: headers});
  }

  saveQuestion() {
    this.utils.loading;

    if (this.form["points_question"].value && this.form["maximumpoints_question"].value === 0) {
      this.utils.showMessages(3, "La cantidad de puntaje debe ser mayor a cero.", "tst");
      this.utils.closeLoading;
      return;
    }

    this.objectQuestion.descriptionQuestion = this.form["description_question"].value;
    this.objectQuestion.feedbackQuestion = this.form["feedback_question"].value;
    this.objectQuestion.hintQuestion = this.form["hint_question"].value;
    this.objectQuestion.maximumpointsQuestion = !this.form["points_question"].value ? 0 : this.form["maximumpoints_question"].value;
    this.objectQuestion.pathurlfileQuestion = this.form["pathurlfile_question"].value;
    this.objectQuestion.pathurlsignQuestion = this.form["pathurlsign_question"].value;
    this.objectQuestion.pathurlvideoQuestion = this.form["pathurlvideo_question"].value;
    this.objectQuestion.pointsQuestion = this.form["points_question"].value;
    this.objectQuestion.levelQuestion = this.levelQuestion;
    this.objectQuestion.titleQuestion = this.form["title_question"].value;
    if (this.updateQuestion) {
      // editar
      console.log("EDITAR PREGUNTA ENCABEZADO: ", this.objectQuestion);
      this.apiUpadateQuestion().subscribe({
        next: response => {
          if (response.data.id_question !== 0) {
            console.log(response);
            this.objectAnswer.optionsAnswer = JSON.stringify(this.structure);
            console.log("EDITAR  PREGUNTA DETALLE: ", this.objectAnswer);
            this.apiUpdateResponses().subscribe(response => {
              console.log(response);
              this.utils.showMessages(2, "Pregunta actualizada correctamente.", "tst");
              this.registerFormQuestion.reset();
              this.validateAnswer(this.typeQuestion);
              this.form["pathurlfile_question"].setValue("");
              this.utils.closeLoading;
            });
          } else {
            this.msgs = [];
            this.utils.showMessages(3, "Ocurrio un error.", "tst");
          }
        }
      });
    } else {
      // nuevo
      console.log(this.structure);
      this.objectQuestion.id = 0;
      this.objectQuestion.stateQuestion = "";
      this.objetctEvaluation.id = parseInt(this.idEvaluation === null ? "" : this.idEvaluation);
      this.objectQuestion.evaluationsIdEvaluation = this.objetctEvaluation;
      this.objectQuestionCategory.id = this.typeQuestion
      this.objectQuestion.questionCategoryIdQuestionCategory = this.objectQuestionCategory;
      console.log(this.objectQuestion);
      this.apiSaveQuestion().subscribe({
        next: response => {
          if (response.data.id_question !== 0) {
            console.log(response);
            // verificar si la pregunta permite archivos en las respuestas
            // console.log(this.structure);
            this.objectQuestion.id = response.data.id_question;
            this.objectAnswer.id = 0;
            this.objectAnswer.dateregAnswer = "";
            this.objectAnswer.dateupdateAnswer = "";
            this.objectAnswer.optionsAnswer = JSON.stringify(this.structure);
            this.objectAnswer.questionsIdQuestion = this.objectQuestion;
            this.apiSaveResponses().subscribe(response => {
              console.log(response);
              this.utils.showMessages(2, "Pregunta agregara correctamente.", "tst");
              this.registerFormQuestion.reset();
              this.validateAnswer(this.typeQuestion);
              this.form["pathurlfile_question"].setValue("");
              this.utils.closeLoading;
            });
          } else {
            this.msgs = [];
            this.utils.showMessages(3, "Ocurrio un error.", "tst");
          }
        }
      });
    }
    this.location.back();
  }

  apiSaveQuestion(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "question/insertquestion";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, this.objectQuestion, {headers: headers});
  }

  apiUpadateQuestion(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "question/updatequestion";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, this.objectQuestion, {headers: headers});
  }

  apiSaveResponses(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "answer/insertanswer";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, this.objectAnswer, {headers: headers});
  }

  apiUpdateResponses(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "answer/updateanswer";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, this.objectAnswer, {headers: headers});
  }

  resetQuestion() {
    this.registerFormQuestion.reset();
  }

  // metodos para la opcion de verdadero y falso
  changeOption(value: any) {
    console.log(this.valRadio);
    this.structure[0].opcion = this.valRadio.split("/")[0];
    this.structure[1].opcion = this.valRadio.split("/")[1];
  }

  // metodos para la opcion unica y multiples
  addNewAlternative() {
    if (this.structure.length > 5) {
      alert("no puedes agregar mas items");
      return;
    }

    this.structure.push({
      "opcion": "Opcion " + (this.structure.length + 1),
      "correct": "No",
      "resource": ""
    });
    this.tmpfiles.push({tmp: null});
  }

  validateOptionUnique(index: number) {
    this.structure[index].correct = "Yes";
    for (let i = 0; i < this.structure.length; i++) {
      if (i !== index) {
        this.structure[i].correct = "No";
      }
    }
  }

  uploadFileResp(event: any, index: number) {
    this.utils.loading;
    event.target.files.length > 0;
    const file = event.target.files[0];
    console.log(file);
    this.tmpfiles[index].tmp = file
    let urlPhoto: string = "";
    this.utils.changeImage(this.tmpfiles[index].tmp).then(response => {
      urlPhoto = this.utils.makePathRecurso(response);
      this.structure[index].resource = urlPhoto;
      this.utils.showMessages(2, "Archivo subido extosamente.", "tst");
      this.utils.closeLoading;
    });
  }

  onUploadFile(event: any) {
    this.utils.loading;
    event.target.files.length > 0;
    const file = event.target.files[0];
    console.log(file.type, file.type.toString().includes("image"));

    if (file.type === "application/pdf" || file.type === "application/x-zip-compressed" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      || file.type.toString().includes("image")) {
      let urlPhoto: string = "";
      this.utils.changeImage(file).then(response => {
        urlPhoto = this.utils.makePathRecurso(response);
        this.form["pathurlfile_question"].setValue(urlPhoto);
        this.utils.closeLoading;
      });
    } else {
      this.utils.closeLoading;
    }
  }

  onUploadVideoSenia(event: any) {
    this.utils.loading;
    event.target.files.length > 0;
    const file = event.target.files[0];

    if (file.type === "video/mp4" || file.type === "video/mp3") {
      let urlPhoto: string = "";
      this.utils.changeImage(file).then(response => {
        urlPhoto = this.utils.makePathRecurso(response);
        this.form["pathurlsign_question"].setValue(urlPhoto);
        this.utils.closeLoading;
      });
    }
  }

  onUploadVideo(event: any) {
    this.utils.loading;
    event.target.files.length > 0;
    const file = event.target.files[0];

    if (file.type === "video/mp4" || file.type === "video/mp3") {
      let urlPhoto: string = "";
      this.utils.changeImage(file).then(response => {
        urlPhoto = this.utils.makePathRecurso(response);
        this.form["pathurlvideo_question"].setValue(urlPhoto);
        this.utils.closeLoading;
      });
    }
  }


  // metodos para la estructura de relcionar
  addNewAlternativeRel() {
    if (this.structure.length > 5) {
      alert("no puedes agregar mas items");
      return;
    }

    this.structure.push({
      "rightSide": "Texto de prueba",
      "resourse_rightSide": "",
      "leftSide": "Texto de prueba",
      "resourse_leftSide": ""
    });

    this.tmpfiles.push({tmpright: null}, {tmpleft: null});
  }

  uploadFileRespR(event: any, index: number) {
    this.utils.loading;
    event.target.files.length > 0;
    const file = event.target.files[0];
    console.log(file);
    this.tmpfiles[index].tmpright = file
    let urlPhoto: string = "";
    this.utils.changeImage(this.tmpfiles[index].tmpright).then(response => {
      urlPhoto = this.utils.makePathRecurso(response);
      this.structure[index].resourse_rightSide = urlPhoto;
      this.utils.closeLoading;
      this.utils.showMessages(2, "Archivo subido extosamente.", "tst");
    });
  }

  uploadFileRespL(event: any, index: number) {
    this.utils.loading;
    event.target.files.length > 0;
    const file = event.target.files[0];
    console.log(file);
    this.tmpfiles[index].tmpleft = file
    let urlPhoto: string = "";
    this.utils.changeImage(this.tmpfiles[index].tmpleft).then(response => {
      urlPhoto = this.utils.makePathRecurso(response);
      this.structure[index].resourse_leftSide = urlPhoto;
      this.utils.showMessages(2, "Archivo subido extosamente.", "tst");
      this.utils.closeLoading;
    });
  }

  // metodos para la estructura de puzzle
  onFileChange(event: any) {
    this.utils.loading;
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
      //this.structure[0].resource =
      this.frmPhoto.patchValue({
        field: file
      });
      let urlPhoto: string = "";
      this.utils.changeImage(this.tmpFile).then(response => {
        urlPhoto = this.utils.makePathRecurso(response);
        this.structure[0].resource = urlPhoto;
        this.utils.showMessages(2, "Archivo subido extosamente.", "tst");
        this.utils.closeLoading;
      });
    }
  }

  // metodos para completar
  addOption() {
    let text_description = document.getElementsByName("descriptionText");
    console.log(this.structure[0].description_question);
    this.insertAtCursor(text_description[0], "[ingresa aqui la palabra correcta]");
  }

  insertAtCursor(myField: any, myValue: string) {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
  }

  deleteAlternative(index: number) {
    console.log(index)
    this.structure.splice(index, 1);
    this.tmpfiles.splice(index, 1);
  }

  validateAnswer(typeQuestion: number) {
    this.structure = [];
    this.tmpfiles = [];
    if (typeQuestion === 1) {
      this.valRadio = "Verdadero/Falso";
      this.structure.push(
        {
          "opcion": this.valRadio.split("/")[0],
          "correct": "Yes"
        },
        {
          "opcion": this.valRadio.split("/")[1],
          "correct": "No"
        }
      );
    } else if (typeQuestion === 2 || typeQuestion === 3) {
      this.structure.push({
        "opcion": "Opcion 1",
        "correct": "No",
        "resource": ""
      })
      this.tmpfiles.push({tmp: null});
    } else if (this.typeQuestion === 7) {
      this.structure.push({
        "opcion": "TEXTO DE PRUEBA"
      });
    } else if (this.typeQuestion === 5) {
      this.structure.push(
        {
          "rightSide": "Texto de prueba",
          "resourse_rightSide": "",
          "leftSide": "Texto de prueba",
          "resourse_leftSide": ""
        }
      );
      this.tmpfiles.push({tmpright: null}, {tmpleft: null});
    } else if (this.typeQuestion === 6) {
      this.structure.push({
        "resource": "",
        "piece_questionarie": 0
      });
      this.tmpfiles.push({tmp: null});
    } else if (this.typeQuestion === 4) {
      this.structure.push({
        "description_question": "texto de prueba",
        "description_question_R": "texto de prueba",
        "options": []
      });
    }
  }

  uploadFileCompPosibleResp(event: any) {
    this.utils.loading;
    event.target.files.length > 0;
    const file = event.target.files[0];
    console.log(file);
    this.file_completed = file;
    //this.tmpfiles[index].tmpleft = file
    let urlPhoto: string = "";
    this.utils.changeImage(this.file_completed).then(response => {
      urlPhoto = this.utils.makePathRecurso(response);
      this.url_file_completed = urlPhoto;
      this.utils.showMessages(2, "Archivo subido extosamente.", "tst");
      this.utils.closeLoading;
    });
  }

  get form() {
    return this.registerFormQuestion.controls;
  }

}
