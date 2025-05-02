import {parse} from 'date-fns';
import {AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";
import { Location } from '@angular/common';
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {Utils} from "../../util/Utils";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {
  _Evaluation,
  EvaluationModel,
  EvaluationQuestionsResponse,
  Options,
  OptionsAnswer, QuestionCategory,
  Questions, QuestionsModel
} from "../../models/evaluation_questionarie";
import {Modules} from "../../models/Modules";
import {Course} from "../../models/Course";
import {ConfirmationService} from "primeng/api";
import {Evaluation} from "../../models/Evaluation"
import {Topic} from "../../models/Topic";
import {LoginServicie} from "../loginServicie";

@Component({
  selector: 'app-updateevacuest',
  templateUrl: './updateevacuest.component.html',
  styleUrls: ['./updateevacuest.component.scss']
})
export class UpdateevacuestComponent implements OnInit, AfterViewInit, OnDestroy {

  idCourse: string | null = "";
  idModule: string | null = "";
  idTopic: string | null = "";
  idEvaluation: number;
  globalUrl: string = "";
  typeEvalutionform: any[];
  new_question_dialog: boolean = false;
  new_question_view_dialog: boolean = false;
  quantity_true: number;
  quantityQuestions: any[];
  public tmpPuzzle: Puzzle;
  public evaluationObject: _Evaluation;
  evaluation: Evaluation;
  auxEvaluation: any;
  public questionObject: Questions;
  public objectQuestionModule = {} as QuestionsModel;
  public objetctEvaluation = {} as EvaluationModel;
  public objectQuestionCategory = {} as QuestionCategory;
  globalUri: string = "";

  frmEvaliationCuestionary: FormGroup;
  public alphabet: string[] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s",
    "t", "u", "v", "w", "x", "y", "z"
  ];

  constructor(
    private _route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private utils: Utils,
    private _http: HttpClient,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    public router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private loginservicie: LoginServicie

  ) {
    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.idModule = this._route.snapshot.paramMap.get("idmodule");
    this.idTopic = this._route.snapshot.paramMap.get("idTopic");
    let idEvaluation_string: string | null = this._route.snapshot.paramMap.get("idResource");
    this.idEvaluation = parseInt(idEvaluation_string !== null ? idEvaluation_string : "0");
    this.breadcrumbService.setItems([
      {
        label: '',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/' + this.idTopic]
      },
      {label: 'Cursos', routerLink: ['/app/coursear']},
      {label: 'Módulos', routerLink: ['/app/coursear/modulear/' + this.idCourse]},
      {label: 'Temas', routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule]},
      {
        label: 'Recursos y evaluaciones',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/' + this.idTopic]
      },
      {
        label: 'Edición de evaluaciones',
        routerLink: ['/app/coursear/modulear/' + this.idCourse + '/topicar/' + this.idModule + '/resourcesar/' + this.idTopic + '/update_evaluation/' + this.idEvaluation]
      }
    ]);
    console.log(this.idEvaluation);
    this.frmEvaliationCuestionary = this.formBuilder.group(
      {
        name: ["", Validators.required],
        description: ["", Validators.required],
        timeEvaluation: ["", Validators.required],
        timeminutesEvaluation: ["",],
        typeEvaluation: ["", Validators.required],
        opportunityEvaluation: ["", Validators.required],
        opportunitiesEvaluation: [""],
        orderCategory: [""],
        allowsReview: [""],
      }
    );
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.loadEvaluations();
    this.loadQuestions();
    this.typeEvalutionform = [
      {label: "---:---", value: null},
      {label: "Evaluación", value: 1},
      {label: "Cuestionario", value: 2},
    ]
    this.selectQuantityQuestions();
  }

  routerOnActivate(snapshot: RouterStateSnapshot): void {
    this.loadEvaluations();
    this.loadQuestions();
    console.log('routerOnActivate');
  }

  ngOnDestroy(): void {
    // Se ejecuta cuando el componente es destruido.
    console.log('ngOnDestroy');
  }

  deleteQuestion(question: Questions, idcategory: number) {
    this.confirmationService.confirm({
      message: '¿Seguro que desea eliminar la pregunta?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        this.utils.loading;
        console.log("pregunta", question);
        this.objectQuestionModule.id = question.id_question;
        this.objectQuestionModule.feedbackQuestion = question.feedback_question;
        this.objectQuestionModule.hintQuestion = question.hint_question;
        this.objectQuestionModule.descriptionQuestion = question.description_question;
        this.objectQuestionModule.titleQuestion = question.title_question;
        this.objectQuestionModule.maximumpointsQuestion = question.maximumpoints_question;
        this.objectQuestionModule.pointsQuestion = question.points_question;
        this.objectQuestionModule.pathurlfileQuestion = question.pathurlfile_question;
        this.objectQuestionModule.pathurlsignQuestion = question.pathurlsign_question;
        this.objectQuestionModule.pathurlvideoQuestion = question.pathurlvideo_question;
        this.objectQuestionModule.levelQuestion = question.level_question;
        this.objetctEvaluation.id = this.idEvaluation;
        this.objectQuestionModule.evaluationsIdEvaluation = this.objetctEvaluation;
        this.objectQuestionCategory.id = idcategory
        this.objectQuestionModule.questionCategoryIdQuestionCategory = this.objectQuestionCategory;
        this.objectQuestionModule.stateQuestion = "I";
        console.log(this.objectQuestionModule);
        this.apiUpdateQuestion(this.objectQuestionModule).subscribe({
          next: response => {
            console.log(response);
            this.utils.showMessages(response.status, response.information, "tst");
            this.loadQuestions();
            this.utils.closeLoading;
          }
        })
      },
      reject: () => {
      },
      key: "positionDialog"
    });
  }

  apiUpdateQuestion(question = {} as QuestionsModel) {
    this.globalUri = this.utils.globalUrl + "question/updatequestion";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<any>(this.globalUri, question, {headers: headers});
  }

  selectQuantityQuestions() {
    //this.utils.loading;
    this.apiSelectQuantityQuestions().subscribe({
      next: response => {
        this.quantityQuestions = response.data;
        console.log(this.quantityQuestions);
        // console.log(this.quantityQuestions[0].number_question);

        //this.utils.showMessages(response.status, response.information, "tst")
        //this.utils.closeLoading;
      }
    })
  }

  apiSelectQuantityQuestions(): Observable<any> {
    console.log(this.quantity_true);
    let url_gq: string;
    url_gq = this.utils.globalUrl;
    url_gq += "evaluation/selectQuantityQuestions";

    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());

    return this._http.post<any>(url_gq, {
      "id_evaluation": (String(this.idEvaluation))
    }, {headers: headers});
  }

  updateQuantityQuestions(idcategory: number, pos: number) {
    this.utils.loading;
    this.apiUpdateQuantityQuestions(idcategory, pos).subscribe({
      next: response => {
        console.log(response);
        this.quantity_true = 0;
        this.utils.showMessages(response.status, response.information, "tst")
        this.utils.closeLoading;
        this.selectQuantityQuestions();
      }
    })
  }

  apiUpdateQuantityQuestions(idcategory: number, pos: number): Observable<any> {
    console.log(this.quantityQuestions[pos].number_question);
    let url_gq: string;
    url_gq = this.utils.globalUrl;
    url_gq += "evaluation/updateQuantityQuestions";

    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    if (this.quantity_true >= 0) {

    } else {
      this.quantity_true = 0;
    }

    return this._http.post<any>(url_gq, {
      "quantity_question": this.quantityQuestions[pos].number_question,
      "id_evaluation": (String(this.idEvaluation)),
      "id_question_category": String(idcategory)
    }, {headers: headers});

  }

  get form() {
    return this.frmEvaliationCuestionary.controls;
  }

  loadEvaluations() {
    this.apiLoadDataEvaluation().subscribe({
      next: response => {
        this.auxEvaluation = response.data[0];
        console.log(this.auxEvaluation);
        this.form["name"].setValue(this.auxEvaluation.name_evaluation);
        this.form["description"].setValue(this.auxEvaluation.description_evaluation);
        this.form["typeEvaluation"].setValue(this.auxEvaluation.type_evaluation);
        this.form["timeEvaluation"].setValue(this.auxEvaluation.time_evaluation);
        this.form["timeminutesEvaluation"].setValue(this.auxEvaluation.timeminutes_evaluation);
        this.form["opportunityEvaluation"].setValue(this.auxEvaluation.opportunity_evaluation);
        this.form["opportunitiesEvaluation"].setValue(this.auxEvaluation.opportunities_evaluation);
        this.form["orderCategory"].setValue(this.auxEvaluation.order_category);
        this.form["allowsReview"].setValue(this.auxEvaluation.allows_review);
      }

    })
  }

  updateParameterQuestion() {
    this.confirmationService.confirm({
      message: '¿Seguro que desea realizar los cambios?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        this.utils.loading;

        if (!this.form['timeEvaluation'].value) {
          this.form['timeminutesEvaluation'].setValue(1);
        }

        // this.evaluation._nameEvaluation =  this.form["name"].value;
        // this.evaluation._descriptionEvaluation =  this.form["description"].value;
        // this.evaluation._typeEvaluation =  this.form["typeEvaluation"].value;
        // this.evaluation._timeEvaluation =  this.form["timeEvaluation"].value;
        // this.evaluation._timeminutesEvaluation =  this.form["timeminutesEvaluation"].value;
        // this.evaluation._opportunityEvaluation =  this.form["opportunityEvaluation"].value;
        // this.evaluation._opportunitiesEvaluation =  this.form["opportunitiesEvaluation"].value;
        // this.evaluation._orderCategory =  this.form["orderByCategory"].value;
        // this.evaluation._allows_review =  this.form["reviewIntent"].value;
        const formatString = 'MMM d, yyyy, h:mm:ss a'; // Formato de la fecha de entrada

        if (typeof this.auxEvaluation.datereg_evaluation === 'string') {
          try {
            this.auxEvaluation.datereg_evaluation = parse(this.auxEvaluation.datereg_evaluation, formatString, new Date());
            this.auxEvaluation.dateupdate_evaluation = parse(this.auxEvaluation.dateupdate_evaluation, formatString, new Date());
          } catch (error) {
            console.error('Error al analizar la fecha');
          }
        }
        let topicAux: Topic;
        topicAux = new Topic(
          parseInt(this.idTopic === null ? "0" : this.idTopic),
          "", "", "", "",
          "", "", "")

        this.evaluation = new Evaluation(
          this.auxEvaluation.id_evaluation,
          this.form['name'].value,
          this.form['description'].value,
          this.auxEvaluation.datereg_evaluation, this.auxEvaluation.dateupdate_evaluation,
          this.form['timeEvaluation'].value,
          this.form['timeEvaluation'].value ? this.form['timeminutesEvaluation'].value : 0,
          this.auxEvaluation.numberquestion_evaluation,
          this.auxEvaluation.state_evaluation,
          this.form['typeEvaluation'].value,
          this.form['opportunityEvaluation'].value,
          this.form['opportunityEvaluation'].value ? this.form['opportunitiesEvaluation'].value : 1,
          this.form['orderCategory'].value,
          this.form['allowsReview'].value
        )
        this.evaluation._topicsIdTopic = topicAux;
        console.log("EDIT EVALUATION");
        console.log(this.evaluation);

        this.apiUpdateEvaluation().subscribe(response => {
          console.log(response);
          this.utils.showMessages(response.status, response.information, "tst");
          this.utils.closeLoading;
        });
      },
      reject: () => {
        this.utils.closeLoading;
      },
      key: "positionDialog"
    });
  }

  apiUpdateEvaluation(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "evaluation/updateevaluation";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, this.evaluation, {headers: headers});
  }

  loadQuestions() {
    this.apiGetQuestions(this.idEvaluation).subscribe({
      next: response => {
        if (response.status == 2) {
          if (response.data.length > 0) {
            this.evaluationObject = response.data[0];
            console.log(this.evaluationObject);
          }
        }
      }
    });
  }

  apiLoadDataEvaluation(): Observable<any> {
    this.globalUrl = this.utils.globalUrl + "evaluation/getevaluation";
    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUrl, {
      "id_evaluation": this.idEvaluation
    }, {headers: headers});
  }

  apiGetQuestions(idEvaluation: number): Observable<EvaluationQuestionsResponse> {
    let url_gq: string;
    url_gq = this.utils.globalUrl;
    url_gq += "evaluation/getAllEvaluationQuestions";

    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());

    return this._http.post<EvaluationQuestionsResponse>(url_gq, {"id_evaluation": idEvaluation}, {headers: headers});
  }

  tipoPregunta(typo: number): string {
    let resp: string = "";
    if (typo == 1) {
      resp = "True or False";
    }
    if (typo == 2) {
      resp = "Simple Option";
    }
    if (typo == 3) {
      resp = "Multiple Option";
    }
    if (typo == 4) {
      resp = "Complete";
    }
    if (typo == 5) {
      resp = "Relate";
    }
    if (typo == 6) {
      resp = "Puzzle";
    }
    if (typo == 7) {
      resp = "Build word";
    }
    return resp;
  }

  public palabra: any = {
    press: -1,
    released: -1
  };

  clickUp(val: number): void {
    console.log(" set", val);
    if (val !== undefined && this.questionObject.answers_[0].complete_parts![val] !== "space") {
      if (this.palabra.release === val) {
        this.palabra.release = -1;
      } else {
        this.palabra.release = val;
        console.log("poner", this.alphabet[this.palabra.press], "en ", this.palabra.release);
        this.questionObject.answers_[0].complete_parts![this.palabra.release] = this.alphabet[this.palabra.press];
        this.palabra.press = -1;
        this.palabra.release = -1;
      }
    }
  }

  clickDown(val: number): void {
    console.log("key", val, this.palabra.press === val);
    if (val !== undefined) {
      if (this.palabra.press === val) {
        this.palabra.press = -1;
      } else {
        this.palabra.press = val;
        this.palabra.release = -1;
      }
    }
  }

  showLetra(letra: string, indice: number): string {
    if (letra === ' ')
      return 'space';
    if (this.questionObject.answers_[0].complete_parts![indice] == undefined)
      return 'void';
    else {
      return this.questionObject.answers_[0].complete_parts![indice];
    }
  }

  partirPreguntaComplete(quest: string): string[] {
    return quest.split(/[\{\}]/);
  }

  desordenar(unArray: any[]): any[] {
    let t = unArray.sort(function (a, b) {
      return (Math.random() - 0.5)
    });
    return [...t];
  }

  previewQuestion(question: Questions) {
    this.new_question_view_dialog = true;
    this.questionObject = question;

    console.log(this.questionObject != undefined && this.questionObject != null);


    let rec: string = "";
    if (this.questionObject.name_questioncategory !== this.tipoPregunta(7)) {
      rec = this.questionObject.answers_[0].options_answer[0].resource!;
    }
    rec = rec != undefined ? rec : "";
    this.questionObject.canResource = (rec.length > 0);

    if (this.questionObject.name_questioncategory == this.tipoPregunta(4)) {
      for (let i = 0; i < this.questionObject.answers_[0].options_answer.length; i++) {
        this.questionObject.answers_[0].complete_parts = this.partirPreguntaComplete(this.questionObject.answers_[0].options_answer[i].description_question);
      }
    }

    if (this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
      this.questionObject.answers_[0].right_parts = Array<OptionsAnswer>(0);
      let tmp: OptionsAnswer;
      for (let index = 0; index < this.questionObject.answers_[0].options_answer.length; index++) {

        tmp = this.questionObject.answers_[0].options_answer[index];
        tmp.ind = index;
        this.questionObject.answers_[0].right_parts.push(tmp);
      }
      this.questionObject.answers_[0].right_parts = this.desordenar(this.questionObject.answers_[0].right_parts);
      console.log("tipo pregujnta 5", this.questionObject.answers_[0].right_parts);
      this.questionObject.answers_[0].responses = Array<OptionsAnswer>(this.questionObject.answers_[0].options_answer.length - 1);
    }
    if (this.questionObject.name_questioncategory == this.tipoPregunta(6)) {
      let imgPath: string = this.questionObject.answers_[0].options_answer[0].resource!;
      let dimensions: number = this.questionObject.answers_[0].options_answer[0].piece_questionarie!;
      this.tmpPuzzle = new Puzzle();
      // imgPath = "assets/imgresource/empty/notification.png";
      this.tmpPuzzle.crearPuzzle(dimensions, imgPath);
      this.questionObject.answers_[0].tmpPuzzle = this.tmpPuzzle;
    }
    if (this.questionObject.name_questioncategory == this.tipoPregunta(7)) {

      let tmpOpcion: OptionsAnswer = this.questionObject.answers_[0].options_answer[0];
      console.log("pregunta tipo 7:", tmpOpcion);

      this.questionObject.answers_[0].complete_parts = Array<string>(tmpOpcion.opcion.split("").length);

    }
    console.log("pregunta: ", this.questionObject);


  }

}

function desordenarRow(unArray: any[]): any[] {
  let t = unArray.sort(function (a, b) {
    return (Math.random() - 0.5)
  });
  return [...t];
}

class Puzzle {

  private maxSizeImg: number = 75;
  private dimens: number = 3;

  public arrayImagePuzzle: string[][];
  public arrayPositionPuzzle: number[][];

  public primerMovimiento: boolean = false;

  public puzzleControls: any = {
    complete: false,
    pressed: {x: -1, y: -1},
    release: {x: -1, y: -1}
  };

  crearPuzzle(cantidad: number, url: string): void {
    this.dimens = Math.sqrt(cantidad);

    let maxSizeImg = this.maxSizeImg * this.dimens;
    this.arrayImagePuzzle = new Array<string[]>(cantidad);
    this.arrayPositionPuzzle = new Array<number[]>(cantidad);
    let mecanvas = document.createElement("canvas") as HTMLCanvasElement;
    //let mecanvas = document.getElementById("tmpImagenCanvas") as HTMLCanvasElement;
    console.log(mecanvas);
    mecanvas.width = maxSizeImg;
    mecanvas.height = maxSizeImg;
    let ctx = mecanvas.getContext('2d')!;
    let local_this = this;
    let img = new Image();
    img.onload = function () {
      img.width = maxSizeImg;
      img.height = maxSizeImg;

      ctx.drawImage(img, 0, 0, maxSizeImg, maxSizeImg);
      let ind = 0;
      for (let y = 0; y < local_this.dimens; y++) {
        local_this.arrayImagePuzzle[y] = new Array<string>(local_this.dimens);
        local_this.arrayPositionPuzzle[y] = new Array<number>(local_this.dimens);
        for (let x = 0; x < local_this.dimens; x++) {
          let imgData = ctx.getImageData(x * local_this.maxSizeImg, y * local_this.maxSizeImg,
            (x * local_this.maxSizeImg) + local_this.maxSizeImg,
            (y * local_this.maxSizeImg) + local_this.maxSizeImg);
          let mincanvas = document.createElement("canvas") as HTMLCanvasElement;
          mincanvas.width = local_this.maxSizeImg;
          mincanvas.height = local_this.maxSizeImg;
          let minctx = mincanvas.getContext('2d')!;
          minctx.putImageData(imgData, 0, 0);

          // console.log("base64: ", mincanvas.toDataURL());
          local_this.arrayImagePuzzle[y][x] = mincanvas.toDataURL();
          local_this.arrayPositionPuzzle[y][x] = ind++;
        }
      }
      /*let imgData = ctx.getImageData(0, 0, local_this.maxSizeImg, local_this.maxSizeImg);
      let mincanvas = document.createElement("canvas") as HTMLCanvasElement;
      mincanvas.width = local_this.maxSizeImg;
      mincanvas.height = local_this.maxSizeImg;
      let minctx = mincanvas.getContext('2d')!;
      minctx.putImageData(imgData, 0, 0);

      console.log("base64: ", mincanvas.toDataURL());
      local_this.objImagePuzzle = mincanvas.toDataURL();*/
      let arrayDesorden: number[] = new Array<number>(local_this.dimens);
      for (let x = 0; x < local_this.dimens; x++) {
        arrayDesorden[x] = x;
      }
      //desordenar las filas
      for (let y = 0; y < local_this.dimens; y++) {
        arrayDesorden = desordenarRow(arrayDesorden);
        for (let x = 0; x < local_this.dimens; x++) {
          let changeimg: string, changeInd: number;
          changeimg = local_this.arrayImagePuzzle[y][arrayDesorden[x]];
          local_this.arrayImagePuzzle[y][arrayDesorden[x]] = local_this.arrayImagePuzzle[y][x];
          local_this.arrayImagePuzzle[y][x] = changeimg;

          changeInd = local_this.arrayPositionPuzzle[y][arrayDesorden[x]];
          local_this.arrayPositionPuzzle[y][arrayDesorden[x]] = local_this.arrayPositionPuzzle[y][x];
          local_this.arrayPositionPuzzle[y][x] = changeInd;
        }
      }
      //console.log("filas ", local_this.arrayPositionPuzzle);
      //desordenar las columnas
      for (let y = 0; y < local_this.dimens; y++) {
        arrayDesorden = desordenarRow(arrayDesorden);
        for (let x = 0; x < local_this.dimens; x++) {
          let changeimg: string, changeInd: number;
          changeimg = local_this.arrayImagePuzzle[arrayDesorden[x]][y];
          local_this.arrayImagePuzzle[arrayDesorden[x]][y] = local_this.arrayImagePuzzle[x][y];
          local_this.arrayImagePuzzle[x][y] = changeimg;

          changeInd = local_this.arrayPositionPuzzle[arrayDesorden[x]][y];
          local_this.arrayPositionPuzzle[arrayDesorden[x]][y] = local_this.arrayPositionPuzzle[x][y];
          local_this.arrayPositionPuzzle[x][y] = changeInd;
        }
      }
    };
    img.crossOrigin = "Anonymous";
    img.src = url;
  }

  mover(x: number, y: number) {
    if (!this.puzzleControls.complete) {
      this.puzzleControls.pressed = {x: x, y: y};
      this.puzzleControls.complete = true;
    } else {
      this.puzzleControls.released = {x: x, y: y};

      let auxInd = this.arrayPositionPuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x];
      this.arrayPositionPuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x] =
        this.arrayPositionPuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x];
      this.arrayPositionPuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x] = auxInd;

      let auxbase64 = this.arrayImagePuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x];
      this.arrayImagePuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x] =
        this.arrayImagePuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x];
      this.arrayImagePuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x] = auxbase64;

      //hacer truco de cambio
      this.puzzleControls.pressed = {x: -1, y: -1};
      this.puzzleControls.released = {x: -1, y: -1};
      this.puzzleControls.complete = false;

      if (!this.primerMovimiento) {
        this.primerMovimiento = true;
      }
    }
  }

  isActive(x: number, y: number) {
    //if(!this.puzzleControls.complete){
    return (this.puzzleControls.pressed.x === x && this.puzzleControls.pressed.y === y);
    //(this.puzzleControls.rel.x === x && this.puzzleControls.pressed.y === y)
    /*}
    return false;*/
  }

  comprobarResultado(): number[] {
    let ind = 0, success = 0;
    for (let y = 0; y < this.dimens; y++) {
      if (this.arrayPositionPuzzle[y] !== undefined) {
        for (let x = 0; x < this.dimens; x++) {
          if (this.arrayPositionPuzzle[y][x] == ind) {
            success++; //fichas en el lugar correcto
          }
          ind++;
        }
      }
    }
    return [success, this.dimens * this.dimens];
  }
}
