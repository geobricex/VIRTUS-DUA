import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subscription, timer} from 'rxjs';
import {Utils} from "../../util/Utils";
import {ActivatedRoute, Router} from '@angular/router';

import {
  Correct,
  _Evaluation,
  EvaluationQuestionsResponse,
  Options,
  OptionsAnswer, PersonsEvaluations,
  Questions, QuestionsModel
} from "../../models/evaluation_questionarie";
import {FormBuilder} from '@angular/forms';
import {StorageService} from "../../authentication/StorageService";
import {ExtendedKeyboardEvent, Hotkey, HotkeysService} from "angular2-hotkeys";
import {AppMainComponent} from "../../app.main.component";
import {AppComponent} from "../../app.component";
import {Puzzle} from "../../util/Puzzle";
import {fabric} from "fabric";
import {LoginServicie} from "../loginServicie";


declare var Artyom: any;

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit, AfterViewInit {
  idCourse: string | null = "";
  idModule: string | null = "";
  idTopic: string | null = "";
  idEvaluation: string | null = "";
  idResource: string | null = "";
  //valRadio: string;
  public vistaVideoSenias: boolean = true;
  viewQuestionBank: boolean = true;
  personsEvaluations = {} as PersonsEvaluations

  private artyom: any = new Artyom();

  private globalUri: string;

  //objeto de la evaluación
  public evaluationObject: _Evaluation;
  public questionObject: Questions;

  public indexQuestionObject: number;
  //abecedario
  public alphabet: string[] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s",
    "t", "u", "v", "w", "x", "y", "z"
  ];
  //
  public tiempoEvaluacion$: Subscription | any;
  public tiempoEvaluacion: number = 0;
  public tiempoEvaluacion_lastQ: number = 0;

  public literalSeleccionado: any;

  valueProgress = 0;

  public sweetFakeAlert: boolean[] = [false, true];
  public sweetFakeAlertFin: boolean = false;
  public sweetFakeAlerttxt: string = "";

  public palabra: any = {
    firstMovimiento: 0,
    press: -1,
    released: -1
  };
  public intentosEnvio: number = 0;

  public tmpPuzzle: Puzzle;

  @ViewChild('canvasEl', {static: true}) CanvasEl: ElementRef<HTMLCanvasElement>;
  private contex: CanvasRenderingContext2D | null;


  constructor(private breadcrumbService: BreadcrumbService,
              public router: Router,
              private _http: HttpClient,
              private _route: ActivatedRoute,
              private utils: Utils,
              private activatedRoute: ActivatedRoute,
              private storageService: StorageService,
              private _hotkeysService: HotkeysService,
              public app: AppComponent,
              private loginservicie: LoginServicie) {

    this.idCourse = this._route.snapshot.paramMap.get("idcourse");
    this.idModule = this._route.snapshot.paramMap.get("idmodule");
    this.idTopic = this._route.snapshot.paramMap.get("idTopic");
    this.idEvaluation = this._route.snapshot.paramMap.get("ideva");
    this.idResource = this._route.snapshot.paramMap.get("idTopic");
    this.breadcrumbService.setItems([
      {
        label: '',
        routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule + '/resources/' + this.idTopic]
      },
      {label: 'Cursos', routerLink: ['/app/course']},
      {label: 'Mis cursos', routerLink: ['/app/mycourse']},
      {label: 'Modulos', routerLink: ['/app/mycourse/modules/' + this.idCourse]},
      {label: 'Temas', routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule]},
      {
        label: 'Recursos y evaluaciones',
        routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule + '/resources/' + this.idTopic]
      },
      {
        label: 'Cuestionario',
        routerLink: ['/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule + '/resources/' + this.idResource + '/questionnaire/' + this.idEvaluation]
      },
    ]);


    // this.breadcrumbService.setItems([
    //   {label: 'Cuestionario', routerLink: ['/app/questionnaire']}
    // ]);
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      let questionnaire = this.activatedRoute.snapshot.params;

      console.log(questionnaire); // OUTPUT 123
      if (questionnaire['ideva'] != undefined) {
        this.obtenerPreguntas(questionnaire['ideva']);
      }
    });
    // this.canvasLineas = new fabric.Canvas('canvasLineas', {
    //   backgroundColor: "white"
    // });
    console.log("canvas, ", this.CanvasEl);
    this.startHotKeysCommands();
    //Rompecabezas


  }

  repetirPregunta() {
    if (this.text2SpeakSupport()) {
      if (this.artyom.isSpeaking()) {
        this.artyom.shutUp();
      }
      // this.artyom.repeatLastSay();
      this.leerPregunta();
    }
  }

  openClose() {
    this.viewQuestionBank = !this.viewQuestionBank;
  }

  ngAfterViewInit(): void {
    //this.showSwal(true);
    //this.changeDetector.detectChanges();
    console.clear();
  }

  ngOnDestroy() {
    if (this.tiempoEvaluacion$ !== undefined) {
      this.tiempoEvaluacion$.unsubscribe();
    }
    if (this.text2SpeakSupport(true) && this.artyom.isSpeaking()) {
      this.artyom.shutUp();
    }
    //Quitar el reconocimiento de voz
    if (this.voiceComandsSupport(true)) {
      this.artyom.fatality().then(() => {
        this.artyom.clearGarbageCollection();
      });
    }
  }

  contarTipoPregunta(tipo: number): number {
    let cantidad: number = 0;
    for (let ind: number = 0; ind < this.evaluationObject.questions_.length; ind++) {
      if (this.evaluationObject.questions_[ind].name_questioncategory == this.tipoPregunta(tipo)) {
        cantidad++;
      }
    }
    return cantidad;
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

  totalPuntos(): number {
    let tpuntos: number = 0;
    for (let ind = 0; ind < this.evaluationObject.questions_.length; ind++) {
      if (this.evaluationObject.questions_[ind].points_question) {
        tpuntos += this.evaluationObject.questions_[ind].maximumpoints_question;
      }
    }
    return tpuntos;
  }

  calcularTotales(): number {
    let total: number = 0;
    for (let ind = 0; ind < this.evaluationObject.questions_.length; ind++) {
      let tmp = this.evaluationObject.questions_[ind].response_points!;
      if (typeof (tmp) === "number") {
        total += tmp;
      }
    }
    //return tiempo;
    return total;
  }

  calcularTiempos(): number {
    let tiempos: number = 0;
    for (let ind = 0; ind < this.evaluationObject.questions_.length; ind++) {
      let tmp = this.evaluationObject.questions_[ind].response_time!;
      if (typeof (tmp) === "number") {
        tiempos += tmp;
      }
    }
    //return tiempo;
    return this.tiempoEvaluacion;
  }

  getCountResueltas(): string {
    let total = this.evaluationObject.questions_.length;
    let respondidas = 0;
    for (let ind = 0; ind < total; ind++) {
      /*if (this.evaluationObject.questions_[ind].canResource != undefined) {
        respondidas++;
      }*/
      // let [resueltoStado, _] = this.verificarRespuestasCorrectas(this.evaluationObject.questions_[ind]);
      let resueltoStado = this.validarPreguntaResuelta(this.evaluationObject.questions_[ind]);
      if (resueltoStado) {
        respondidas++;
      }
    }
    return respondidas + " / " + total;
  }

  getCountReplied(): any {
    let total = this.evaluationObject.questions_.length;
    let respondidas = 0;
    for (let ind = 0; ind < total; ind++) {
      /*if (this.evaluationObject.questions_[ind].canResource != undefined) {
        respondidas++;
      }*/
      let [resueltoStado, _] = this.verificarRespuestasCorrectas(this.evaluationObject.questions_[ind]);
      if (resueltoStado) {
        respondidas++;
      }
    }
    return [respondidas, total];
  }

  getNivelQuestion(level: number): string {
    let resp = "Desconocido";
    if (level == 1) {
      resp = "Principiante";
    }
    if (level == 2) {
      resp = "Básico";
    }
    if (level == 3) {
      resp = "Medio";
    }
    if (level == 4) {
      resp = "Difícil";
    }
    if (level == 5) {
      resp = "Avanzado";
    }
    return resp;
  }

  obtenerPreguntas(idEvaluacion: number): void {
    //let idEvaluacion: number = 1;
    //codigo para extraer de la url o veran donde
    this.obtenerPreguntasWS(idEvaluacion).subscribe(response => {
      console.log("obtenerPreguntasWS: ", response);
      if (response.status == 2) {
        if (response.data.length > 0) {
          this.evaluationObject = response.data[0];

          //if (this.evaluationObject.time_evaluation) {
          this.tiempoEvaluacion = 0;//60 * 60;//this.evaluationObject.timeminutes_evaluation * 60;
          this.tiempoEvaluacion$ = timer(0, 1000)
            .subscribe((iter: any) => {
              //console.log("tiempoEvaluacion: " + iter);
              //if (this.tiempoEvaluacion >= 60 * 60) {
              //this.tiempoEvaluacion$.unsubscribe();
              /*Código para indicar que se terminó el tiempo*/
              //}
              this.tiempoEvaluacion++;
            });
          //}
          if (this.voiceComandsSupport()) {
            // if (this.storageService.getCurrentUser().email != "anthony.pachay2017@uteq.edu.ec") {
            this.startContinuousArtyom();
            // }
          }
          // if (this.storageService.getCurrentUser().email == "anthony.pachay2017@uteq.edu.ec") {
          //   this.cambiarPregunta(0, true);
          // } else {
          this.cambiarPregunta(0, true);
          // }
          //this.initCanvas(false);
          setTimeout(() => {
            console.log("silenciar video")
            this.autoClick("#silenciar_video");
          }, 500);
        }
      }
    });

  }


  verificarRespuestasCorrectas(questionItem: Questions): [boolean, number] {
    if (questionItem.name_questioncategory == this.tipoPregunta(7)) {
      if (questionItem.answers_[0].complete_parts !== undefined) {
        let flagAlltrue: boolean = true;
        let indT = 0;
        let indTS = 0;
        let palabra = "";
        for (let ind = 0; ind < questionItem.answers_[0].options_answer[0].opcion.length; ind++) {
          let tmp = questionItem.answers_[0].complete_parts![ind];
          tmp = tmp == undefined ? ' ' : tmp.toUpperCase();
          if (questionItem.answers_[0].options_answer[0].opcion[ind].toUpperCase() == tmp) {
            indTS++;
          } else {
            flagAlltrue = false;
          }
          palabra += tmp;
        }
        questionItem.answers_[0].responses = [<OptionsAnswer>{opcion: palabra}];
        indT = questionItem.answers_[0].options_answer[0].opcion.length;
        questionItem.num_intentos = this.intentosEnvio;
        questionItem.num_mov = this.palabra.firstMovimiento;
        return [ // en caso de las evaluaciones,
          // cambiar "flagAlltrue && indTS == indT" por "this.palabra.firstMovimiento > 0"
          flagAlltrue && indTS == indT,
          questionItem.maximumpoints_question * ((indTS / indT))];
      } else {
        return [false, 0];
      }
    } else if (questionItem.name_questioncategory == this.tipoPregunta(6) && this.tmpPuzzle !== undefined) {
      let resp: number[] = this.tmpPuzzle.comprobarResultado();
      questionItem.num_mov = this.tmpPuzzle.primerMovimiento;
      questionItem.num_intentos = this.intentosEnvio;
      return [ // en caso de las evaluaciones,
        // cambiar resp[0] == resp[1] por this.tmpPuzzle.primerMovimiento > 0
        resp[0] == resp[1],
        questionItem.maximumpoints_question * ((resp[0] / resp[1]))];
    } else {
      // console.log("apachurra-----------------------------------------------0");
      if ((questionItem.answers_[0].options_answer[0].response !== undefined &&
          questionItem.answers_[0].options_answer[0].response.length > 0) ||
        questionItem.answers_[0].responses != undefined)
        //verdadero o falso O unica seleccion
        // console.log("apachurra-----------------------------------------------1");
        if ((questionItem.name_questioncategory == this.tipoPregunta(2)
            || questionItem.name_questioncategory == this.tipoPregunta(1))
          && questionItem.answers_[0].responses != undefined) {
          // console.log("apachurra-----------------------------------------------2");
          return [
            // @ts-ignore
            questionItem.answers_[0].responses.correct == "Yes", // questionItem.answers_[0].responses.correct !== undefined
            // @ts-ignore
            questionItem.answers_[0].responses.correct == "Yes" ? questionItem.maximumpoints_question : 0];
        } else if (questionItem.name_questioncategory == this.tipoPregunta(3) && questionItem.answers_[0].responses !== undefined) {
          let flagAlltrue: boolean = true;
          let indT = 0;
          let indTS = 0;
          for (let ind = 0; ind < questionItem.answers_[0].responses.length; ind++) {
            if (questionItem.answers_[0].responses[ind].correct == "Yes") {
              indTS++;
            } else {
              flagAlltrue = false;
            }
          }
          for (let ind = 0; ind < questionItem.answers_[0].options_answer.length; ind++) {
            if (questionItem.answers_[0].options_answer[ind].correct == "Yes") {
              indT++;
            }
          }
          return [ // en caso de las evaluaciones,
            // cambiar "flagAlltrue && indTS == indT"
            // por "questionItem.answers_[0].responses.length > 0"
            flagAlltrue && indTS == indT,
            questionItem.maximumpoints_question * ((indTS / indT))];
        } else if (questionItem.name_questioncategory == this.tipoPregunta(4) &&
          questionItem.answers_[0].complete_parts !== undefined) {
          // console.log("objeto:", questionItem);
          let elemento: string[] = [];
          for (let ind = 0; ind < questionItem.answers_[0].complete_parts!.length; ind++) {
            if (questionItem.answers_[0].complete_parts![ind] != "$option$") {
              elemento.push(questionItem.answers_[0].complete_parts![ind]);
            } else {
              if (questionItem.answers_[0].options_answer[0].response[ind] != undefined)
                elemento.push(questionItem.answers_[0].options_answer[0].response[ind].option);
            }
          }
          let flag: boolean = elemento.join('') == questionItem.answers_[0].options_answer[0].description_question_R;
          // console.log(flag, "Respuseta final: ", elemento);
          return [flag, flag ? questionItem.maximumpoints_question : 0];
        } else if (questionItem.name_questioncategory == this.tipoPregunta(5)) {
          //this.questionObject.answers_[0].options_answer
          //this.questionObject.answers_[0].right_parts
          let flagAlltrue: boolean = true;
          let indT = 0;
          let indTS = 0;
          for (let ind = 0; ind < questionItem.answers_[0].options_answer.length; ind++) {
            if (questionItem.answers_[0].options_answer[ind] !== undefined &&
              questionItem.answers_[0].responses[ind] !== undefined &&
              questionItem.answers_[0].options_answer[ind].rightSide
              == questionItem.answers_[0].responses[ind].rightSide &&
              questionItem.answers_[0].options_answer[ind].resourse_rightSide
              == questionItem.answers_[0].responses[ind].resourse_rightSide
            ) {
              indTS++;
            } else {
              flagAlltrue = false;
            }
          }
          indT = questionItem.answers_[0].options_answer.length;
          return [ // en caso de las evaluaciones,
            // cambiar "flagAlltrue && indTS == indT"
            // por "questionItem.answers_[0].responses.length > 0"
            flagAlltrue && indTS == indT,
            questionItem.maximumpoints_question * ((indTS / indT))];
        }
    }
    return [false, 0];
  }

  validarPreguntaResuelta(questionItem: Questions): boolean {
    if (questionItem.name_questioncategory == this.tipoPregunta(4)) {
      return (questionItem.answers_[0].options_answer[0].response !== undefined
        && questionItem.answers_[0].options_answer[0].response.length > 0);

    } else if (questionItem.name_questioncategory == this.tipoPregunta(7)) {
      return (questionItem.answers_[0].complete_parts !== undefined
        && questionItem.answers_[0].complete_parts.length > 0);
    } else if (questionItem.name_questioncategory == this.tipoPregunta(6)) {
      return questionItem.answers_[0].tmpPuzzle !== undefined && questionItem.answers_[0].tmpPuzzle.primerMovimiento;
    } else {
      if (questionItem.answers_[0].responses != undefined)
        return (questionItem.answers_[0].responses.length > 0
          || Object.keys(questionItem.answers_[0].responses).length > 0);
    }
    return false;
  }

  validarPreguntaRecurso(elemt: string): boolean {
    if (elemt != undefined && elemt != null)
      return (elemt.length > 0) && this.app.visualResource;
    return false;
  }


  partirPreguntaComplete(quest: string): string[] {
    return quest.split(/[\{\}]/);
  }

  miliseguntos2Segundos(tiempo: number): string {
    let h = Math.floor(tiempo / 3600).toString().padStart(2, '0');
    let m = Math.floor(tiempo % 3600 / 60).toString().padStart(2, '0');
    let s = Math.floor(tiempo % 60).toString().padStart(2, '0');
    if (h == '00') {
      return m + ":" + s;
    } else {
      return h + ":" + m + ":" + s;
    }
  }

  obtenerExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

  isImg(filename: string): boolean {
    let formats = ["gif", "jpeg", "jpg", "png"];
    return formats.indexOf(this.obtenerExtension(filename)) != -1;
  }

  isPdf(filename: string): boolean {
    return "pdf" == this.obtenerExtension(filename);
  }

  hackSaltarin(indice: number) {
    if (this.storageService.loadSessionData().user.email == "anthony.pachay2017@uteq.edu.ec") {
      console.log("super salto, kuchau");
      this.cambiarPregunta(indice, true);
    }
  }

  cambiarPregunta(indice: number, flag = false): void {
    console.log("cambia a pregunta:" + indice);
    console.log(this.questionObject != undefined && this.questionObject != null);
    if (!flag) {
      if (this.questionObject != null && this.questionObject != undefined) {
        console.log(this.validarPreguntaResuelta(this.questionObject));
        if (this.validarPreguntaResuelta(this.questionObject)) {
          //La preguntaha sido contestada
          //validar las respuestas que he dado
          console.log("FeedBack: ", this.questionObject.feedback_question);
          //this.utils.showMessages(1, "FeedBack: " + this.questionObject.feedback_question);
          let [flagCorrect, points] = this.verificarRespuestasCorrectas(this.questionObject);
          this.questionObject.response_points = points;
          console.log(this.questionObject);
          this.showSwal(flagCorrect, this.indexQuestionObject);
          this.intentosEnvio++;
          this.questionObject.num_intentos = this.intentosEnvio;

          if (!flagCorrect) {
            return;
          } else {
            this.intentosEnvio = 0;
            if (this.valueProgress < 100) {
              this.valueProgress = this.valueProgress + ((100) / this.evaluationObject.questions_.length);
            }
            this.questionObject.response_time = (this.tiempoEvaluacion - (flag ? 10 : 0)) - this.tiempoEvaluacion_lastQ;
            this.tiempoEvaluacion_lastQ = this.tiempoEvaluacion;
          }
        } else {
          console.log("Primero debes responder la pregunta");
          this.utils.showMessages(3, "Primero debe responder la pregunta");
          return;
        }
      }
    }
    if (indice != this.indexQuestionObject) {
      this.indexQuestionObject = indice;
      this.questionObject = this.evaluationObject.questions_[this.indexQuestionObject];
      console.log("cambia a pregunta:", this.questionObject);
      let rec: string = "";
      if (this.questionObject.name_questioncategory !== this.tipoPregunta(7)) {
        rec = this.questionObject.answers_[0].options_answer[0].resource!;
      } else {
        this.palabra.firstMovimiento = 0;
      }
      rec = rec != undefined ? rec : "";
      this.questionObject.canResource = (rec.length > 0);
      if (this.questionObject.name_questioncategory == this.tipoPregunta(4)) {
        for (let i = 0; i < this.questionObject.answers_[0].options_answer.length; i++) {
          this.questionObject.answers_[0].complete_parts = this.partirPreguntaComplete(this.questionObject.answers_[0].options_answer[i].description_question);
        }
        this.questionObject.answers_[0].options_answer[0].response = Array<Options>(this.questionObject.answers_[0].complete_parts!.length - 1);
      }
      if (this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
        //this.questionObject.answers_[0].right_parts = [...this.questionObject.answers_[0].options_answer];
        this.questionObject.answers_[0].right_parts = Array<OptionsAnswer>(0);
        let tmp: OptionsAnswer;
        for (let index = 0; index < this.questionObject.answers_[0].options_answer.length; index++) {
          //tmp.opcion = this.questionObject.answers_[0].options_answer[index].rightSide;
          //tmp.resource = this.questionObject.answers_[0].options_answer[index].resourse_rightSide;
          tmp = this.questionObject.answers_[0].options_answer[index];
          tmp.ind = index;
          this.questionObject.answers_[0].right_parts.push(tmp);
        }
        this.questionObject.answers_[0].right_parts = this.desordenar(this.questionObject.answers_[0].right_parts);
        for (let index = 0; index < this.questionObject.answers_[0].right_parts.length; index++) {
          this.questionObject.answers_[0].right_parts[index].ind = index;
        }
        console.log("tipo pregujnta 5", this.questionObject.answers_[0].right_parts);
        this.questionObject.answers_[0].responses = Array<OptionsAnswer>(this.questionObject.answers_[0].options_answer.length - 1);

        this.preguntaUnirConLinea(this.questionObject.answers_[0]);
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
        // this.questionObject.answers_[0].complete_parts = this.desordenar(tmpOpcion.opcion.split(""));
        // this.questionObject.answers_[0].complete_parts = tmpOpcion.opcion.split("");
        this.questionObject.answers_[0].complete_parts = Array<string>(tmpOpcion.opcion.split("").length);

        // let x:OptionsAnswer = {opcion: ""};
        // this.questionObject.answers_[0].responses = Array<OptionsAnswer>(tmpOpcion.opcion.split("").length);
      }
      console.log("pregunta: ", this.questionObject);
    }
    this.initCanvas(flag);
    //reiniciamos los intentos
    this.palabra.totalIntentos = 0;
    // el browser es comantible con el speaker?
    if (this.text2SpeakSupport()) {
      // if (this.storageService.getCurrentUser().email != "anthony.pachay2017@uteq.edu.ec") {
      this.leerPregunta();
      // }
    }
  }


  obtenerPreguntasWS(idEvaluacion: number): Observable<EvaluationQuestionsResponse> {
    let urlServicio: string;
    urlServicio = this.utils.globalUrl;
    console.log("servicio: ", urlServicio);
    urlServicio += "evaluation/getEvaluationQuestions";
    /*if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      urlServicio = "virtusbk/evaluation/getEvaluationQuestions";
    } else {
      urlServicio = "virtus_bk/evaluation/getEvaluationQuestions";
    }*/

    let headers = new HttpHeaders()
      //.set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<EvaluationQuestionsResponse>(urlServicio, {"id_evaluation": idEvaluacion}, {headers: headers});
  }


  changeRadio(ind: number): void {
    console.log("cambio:", ind);
    console.log("todos:", this.questionObject.answers_[0]);
  }

  /*auto click*/
  autoClick(selector: string): void {
    let btnStart = document.querySelector(selector);
    if (btnStart) (btnStart as HTMLFormElement).click();
  }

  public feedBackQuestionObject: Questions;

  showSwal(correcta: boolean, indexQuestionObject: number): void {
    this.sweetFakeAlert[0] = true;
    this.sweetFakeAlert[1] = correcta;
    this.sweetFakeAlerttxt = this.sweetFakeAlert[1] ? this.evaluationObject.questions_[indexQuestionObject].feedback_question :
      this.evaluationObject.questions_[indexQuestionObject].hint_question
    this.feedBackQuestionObject = this.evaluationObject.questions_[indexQuestionObject];
    /*let tiempoSwal$ = timer(0, 1000)
      .subscribe((iter: any) => {
        if (iter >= 10) {
          tiempoSwal$.unsubscribe();
          this.sweetFakeAlert[0] = false;
        }
      });*/
    let cadena = "";
    if (correcta) {
      cadena += "¡Geniál!\n recordemos que \n" + this.questionObject.feedback_question;
    } else {
      cadena += "¡Oh no!\n Te daremos una pista \n" + this.questionObject.hint_question;
    }
    this.decirAlgo(cadena);
  }


  /*Paginar preguntas*/
  siguientePregunta(): void {

    let ind = this.indexQuestionObject + 1;
    if (ind >= this.evaluationObject.questions_.length) {
      ind = this.evaluationObject.questions_.length - 1;
    }
    //this.questionObject = this.evaluationObject.questions_[this.indexQuestionObject];
    console.log("cambiarPregunta()", ind);
    this.cambiarPregunta(ind);
  }

  anteriorPregunta(): void {
    console.log("siguiente pregunta");
    let ind = this.indexQuestionObject - 1;
    if (ind < 0) {
      ind = 0;
    }
    //this.questionObject = this.evaluationObject.questions_[this.indexQuestionObject];
    this.cambiarPregunta(ind);
  }

  desordenar(unArray: any[]): any[] {
    let t = unArray.sort(function (a, b) {
      return (Math.random() - 0.5)
    });
    return [...t];
  }

  /*Video Player*/

  public btnVideoControl: any;
  public btnVideoSignControl: any;

  initVideoControls(): void {
    this.btnVideoControl = document.querySelector("#pathurlvideo_question");
  }

  initVideoSignControls(): void {
    this.btnVideoSignControl = document.querySelector("#pathurlsign_question");
  }

  playSignVideo() {
    this.initVideoSignControls()
    if (this.btnVideoSignControl) (this.btnVideoSignControl as HTMLFormElement)['play']();
  }

  pauseSignVideo() {
    this.initVideoSignControls();
    if (this.btnVideoSignControl) (this.btnVideoSignControl as HTMLFormElement)['pause']();
  }

  mutedSingVideo() {
    this.initVideoSignControls();
    if (this.btnVideoSignControl) {
      let actual: boolean = (this.btnVideoSignControl as HTMLFormElement)['muted'];
      (this.btnVideoSignControl as HTMLFormElement)['muted'] = !actual;
    }
  }

  playVideo() {
    this.initVideoControls();
    //console.log("play video",this.btnVideoControl,  (this.btnVideoControl != undefined));
    if (this.btnVideoControl) (this.btnVideoControl as HTMLFormElement)['play']();
  }

  pauseVideo() {
    this.initVideoControls();
    if (this.btnVideoControl) (this.btnVideoControl as HTMLFormElement)['pause']();
  }

  mutedVideo() {
    this.initVideoControls();
    if (this.btnVideoControl) {
      let actual: boolean = (this.btnVideoControl as HTMLFormElement)['muted'];
      (this.btnVideoControl as HTMLFormElement)['muted'] = !actual;
    }
  }

  evaluarPreguntasSencillas(wildcard: string): void {
    console.log("wilcardOriginal:" + wildcard);
    wildcard = wildcard.trim().replace(/[^a-zA-Z]+/, "");
    console.log("wildcard:", wildcard, this.alphabet.indexOf(wildcard.trim()));
    if (this.alphabet.indexOf(wildcard.trim()) > -1) {
      //this.artyom.say("Ha indicado la selección del literal " + wildcard);
      console.log("Ha indicado la selección del literal " + wildcard);

      if (this.questionObject.name_questioncategory == this.tipoPregunta(1)) {
        if (this.questionObject.canResource) {
          this.autoClick("#option_vf_" + wildcard.trim());
        } else {
          this.autoClick("#option_vf_" + wildcard.trim());
        }
      } else if (this.questionObject.name_questioncategory == this.tipoPregunta(2)) {
        if (this.questionObject.canResource) {
          this.autoClick("#option_rd_2_" + wildcard.trim());
        } else {
          this.autoClick("#option_rd_" + wildcard.trim());
        }
      } else if (this.questionObject.name_questioncategory == this.tipoPregunta(3)) {
        if (this.questionObject.canResource) {
          this.autoClick("#option_ck_2_" + wildcard.trim());
        } else {
          this.autoClick("#option_ck_" + wildcard.trim());
        }
      }
    } else {
      //this.artyom.say("No se encuentra ese literal");
      console.log("No se encuentra ese literal")
    }
  }

  evaluar_control_video(wildcard: string, i: number, database: string[]): void {
    wildcard = wildcard.trim().replace(/[^a-zA-Z]+/, "");
    console.log("evaluar_control_video:", wildcard, i, database.indexOf(wildcard.trim()));
    if (database.indexOf(wildcard.trim()) > -1) {
      //this.artyom.say("Ha indicado la selección del literal " + wildcard);
      console.log("evaluar_control_video " + wildcard);

      console.log("#video_" + wildcard.trim() + ": => click")
      this.autoClick("#" + wildcard.trim().toLowerCase() + "_video_rec");
    } else {
      console.log("No se encuentra el evaluar_control_video")
    }
  }

  evaluar_control_evaluacion(wildcard: string, database: string[]): void {
    wildcard = wildcard.trim().toLowerCase().replace(/[^a-zñ]+/, "");
    console.log("evaluar_control_evaluacion:", wildcard, database.indexOf(wildcard.trim()));
    if (database.indexOf(wildcard.trim()) > -1) {
      //this.artyom.say("Ha indicado la selección del literal " + wildcard);

      if (wildcard.trim() == "señas") {
        this.vistaVideoSenias = !this.vistaVideoSenias;
      } else if (wildcard.trim() == "bancos") {
        this.viewQuestionBank = !this.viewQuestionBank;
      } else {
        this.autoClick("#evt_control_" + wildcard.trim());
        console.log("evaluar_control_evaluacion: " + "evt_control_" + wildcard);
      }
    } else {
      console.log("No se encuentra es evaluar_control_evaluacion")
    }
  }

  /*Comandos de voz*/

  voiceComandsSupport(isDestroy: boolean = false): boolean {
    //let microphoneApi: boolean = window.hasOwnProperty('webkitSpeechRecognition') && window.hasOwnProperty('speechSynthesis');
    let microphoneApi: boolean = this.artyom.recognizingSupported();
    if (isDestroy) {
      return microphoneApi;
    }
    return microphoneApi && this.app.voiceCommand;
  }

  text2SpeakSupport(isDestroy: boolean = false): boolean {
    let microphoneApi: boolean = this.artyom.speechSupported();
    if (isDestroy) {
      return microphoneApi;
    }
    return microphoneApi && this.app.auditoryResource;
  }

  isDesktopDevice(): boolean {
    return this.artyom.Device.isMobile();
  }

  take(values: number): void {
    console.log("Hola la tecla z" + values);
  }

  startHotKeysCommands(): void {
    let keyMaster = "shift";
    // this._hotkeysService.add(new Hotkey(keyMaster + '+a', (event: KeyboardEvent): boolean => {
    //   console.log('Typed hotkey');
    //   return false; // Prevent bubbling
    // }));
    //https://npm.io/package/angular2-hotkeys
    //https://craig.is/killing/mice
    this._hotkeysService.add(new Hotkey([keyMaster + '+a', keyMaster + '+b', keyMaster + '+c', keyMaster + '+d', keyMaster + '+e', keyMaster + '+f'], (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
      console.log('Combo: ' + combo); // 'Combo: meta+shift+g' or 'Combo: alt+shift+s'
      let letra = combo.replace(keyMaster + "+", "");
      console.log("selecciona el literal [" + combo + "]");
      if (this.questionObject.name_questioncategory == this.tipoPregunta(1) ||
        this.questionObject.name_questioncategory == this.tipoPregunta(2) ||
        this.questionObject.name_questioncategory == this.tipoPregunta(3)) {
        this.evaluarPreguntasSencillas(letra);
      } else {
        //alert("comando actualmente no soportado")
      }
      let e: ExtendedKeyboardEvent = event;
      e.returnValue = false; // Prevent bubbling
      return e;
    }));
    let comandos = ["right", "left", "enter", "esc", "backspace", "tab"];
    this._hotkeysService.add(new Hotkey([keyMaster + '+' + comandos[0], keyMaster + '+' + comandos[1],
        keyMaster + '+' + comandos[2], keyMaster + '+' + comandos[3], keyMaster + '+' + comandos[4], 'shift+' + comandos[5]]
      , (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
        console.log('Combo: ' + combo); // 'Combo: meta+shift+g' or 'Combo: alt+shift+s'

        let comodin = combo.replace(keyMaster + "+", "");
        let database: string[] = ["siguiente", "anterior", "enviar", "señas", "repetir", "bancos"];
        let indice = comandos.indexOf(comodin);
        if (indice > -1) {
          this.evaluar_control_evaluacion(database[indice], database);
        }

        let e: ExtendedKeyboardEvent = event;
        e.returnValue = false; // Prevent bubbling
        return e;
      }));

    this._hotkeysService.add(new Hotkey([
        keyMaster + ' a a', keyMaster + ' a b', keyMaster + ' a c', keyMaster + ' a d', keyMaster + ' a e', keyMaster + ' a f',
        keyMaster + ' b a', keyMaster + ' b b', keyMaster + ' b c', keyMaster + ' b d', keyMaster + ' b e', keyMaster + ' b f',
        keyMaster + ' c a', keyMaster + ' c b', keyMaster + ' c c', keyMaster + ' c d', keyMaster + ' c e', keyMaster + ' c f',
        keyMaster + ' d a', keyMaster + ' d b', keyMaster + ' d c', keyMaster + ' d d', keyMaster + ' d e', keyMaster + ' d f',
        keyMaster + ' e a', keyMaster + ' e b', keyMaster + ' e c', keyMaster + ' e d', keyMaster + ' e e', keyMaster + ' e f',
        keyMaster + ' f a', keyMaster + ' f b', keyMaster + ' f c', keyMaster + ' f d', keyMaster + ' f e', keyMaster + ' f f',

      ]
      , (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
        console.log('Combo: ' + combo); // 'Combo: meta+shift+g' or 'Combo: alt+shift+s'

        // combo = combo.replace(keyMaster, "");
        // combo = combo.replace(/\s/, "");
        // console.log("combo2:"+ combo);
        let [lit, opt] = combo.split(" ");
        console.log("combo2:" + lit + opt);
        let literal: number = this.alphabet.indexOf(lit);
        let opcion: number = this.alphabet.indexOf(opt);
        if (literal != -1 && opcion != -1) {
          if (this.questionObject.name_questioncategory == this.tipoPregunta(4)) {
            //this.questionObject.answers_[0].complete_parts![opcion];
            //buscamos el indice al que se le debería ubicar el valor para que se presente
            //todo bien en la interfaz, una solución poco elegante pero válida
            let trueIndex = 0, count = -1;
            for (let ind = 0; ind < this.questionObject.answers_[0].complete_parts!.length; ind++) {
              if (this.questionObject.answers_[0].complete_parts![ind] == "$option$") {
                trueIndex = ind;
                count++;
              }
              if (count == literal) {
                ind = this.questionObject.answers_[0].complete_parts!.length;
              }
            }
            this.questionObject.answers_[0].options_answer[0].response[trueIndex] = this.questionObject.answers_[0].options_answer[0].options[opcion];
            console.log("respuseta: ", this.questionObject.answers_[0].options_answer[0].response);
          } else if (this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
            this.questionObject.answers_[0].responses[literal] = this.questionObject.answers_[0].right_parts![opcion];
          }
        }
        let e: ExtendedKeyboardEvent = event;
        e.returnValue = false; // Prevent bubbling
        return e;
      }));
  }

  startContinuousArtyom(): void {

    this.artyom.fatality();
    let local_this = this;
    let myGroup: any = [
      {
        description: "Si el usuario indica un literal que se encuentra en la lista",
        smart: true, // Activar comando como un comando smart para poder usar comodines
        indexes: ["literal *"],//, "opción *"
        action: function (i: number, wildcard: string) {
          //let database: string[] = ["a", "b", "c", "d", "e", "f"];
          console.log("literal_wilcardOriginal:" + wildcard);
          if (local_this.questionObject.name_questioncategory == local_this.tipoPregunta(1) ||
            local_this.questionObject.name_questioncategory == local_this.tipoPregunta(2) ||
            local_this.questionObject.name_questioncategory == local_this.tipoPregunta(3)) {
            local_this.evaluarPreguntasSencillas(wildcard);
          } else {
            this.utils.showMessages(3, "Comando actualmente no soportado");
          }

        }
      },
      {
        description: "Si el usuario indica un literal que se encuentra en la lista",
        smart: true, // Activar comando como un comando smart para poder usar comodines
        indexes: ["relacionar * opción *"],//, "opción *"
        action: function (i: number, wildcard: string) {
          //let database: string[] = ["a", "b", "c", "d", "e", "f"];
          console.log("literal_wilcardOriginal:", wildcard);
          //local_this.evaluar(wildcard, i);
        }
      },
      {
        description: "controles de video",
        smart: true, // Activar comando como un comando smart para poder usar comodines
        indexes: ["video *"],
        action: function (i: number, wildcard: string) {
          let database: string[] = ["reproducir", "pausar", "silenciar"];
          //reproducir_video
          //pausar_video
          //silenciar_video
          local_this.evaluar_control_video(wildcard, i, database);
        }
      }, {
        description: "controles del contexto evaluativo",
        smart: true, // Activar comando como un comando smart para poder usar comodines
        indexes: ["comando *"],
        action: function (i: number, wildcard: string) {
          let database: string[] = ["siguiente", "anterior", "enviar", "señas", "repetir", "bancos"];
          local_this.evaluar_control_evaluacion(wildcard, database);
        }
      }
    ];

    this.artyom.addCommands(myGroup);


    this.artyom.initialize({
      lang: "es-ES",
      continuous: true, // Artyom will listen foreversilenciar
      debug: false, // Show what recognizes in the Console
      listen: true, // Start listening after this
      speed: 1, // Talk a little bit slow
      mode: "normal", // This parameter is not required as it will be normal by default,
      executionKeyword: "escucha"
    }).then(function () {
      console.log("artyom configurado...");
    });

  }

  cancelarEscuchaComandosVoz(): void {
    if (this.artyom.isObeying()) {
      this.artyom.dontObey();
    } else {
      this.artyom.obey();
    }
  }

  leerPregunta(): void {


    let reader: string = "";
    reader += this.questionObject.title_question + " \n";
    reader += this.questionObject.description_question + " \n";

    if (this.questionObject.name_questioncategory == this.tipoPregunta(1) ||
      this.questionObject.name_questioncategory == this.tipoPregunta(2) ||
      this.questionObject.name_questioncategory == this.tipoPregunta(3)) {
      for (let i = 0; i < this.questionObject.answers_[0].options_answer.length; i++) {
        reader += "literal " + this.alphabet[i] + " \n";
        reader += this.questionObject.answers_[0].options_answer[i].opcion + " \n";
      }
    } else if (this.questionObject.name_questioncategory == this.tipoPregunta(4)) {
      //completa
      for (let i = 0; i < this.questionObject.answers_[0].complete_parts!.length; i++) {
        let tmpString = this.questionObject.answers_[0].complete_parts![i];
        tmpString = tmpString === "$option$" ? "puntos suspensivos" : tmpString;
        reader += tmpString;
      }
      reader += "\n las posibles respuestas son: \n";

      for (let i = 0; i < this.questionObject.answers_[0].options_answer.length; i++) {
        reader += "literal " + this.alphabet[i] + " \n";
        reader += this.questionObject.answers_[0].options_answer[i].leftSide + " \n";
      }

    } else if (this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
      //relaciona
      for (let i = 0; i < this.questionObject.answers_[0].options_answer.length; i++) {
        reader += "literal " + this.alphabet[i] + " \n";
        reader += this.questionObject.answers_[0].options_answer[i].leftSide + " \n";
      }
      reader += "las posibles respuestas son: \n";
      for (let i = 0; i < this.questionObject.answers_[0].options_answer.length; i++) {
        reader += "literal " + this.alphabet[i] + " \n";
        reader += this.questionObject.answers_[0].options_answer[i].rightSide + " \n";
      }
    } else if (this.questionObject.name_questioncategory == this.tipoPregunta(6)) {
    } else if (this.questionObject.name_questioncategory == this.tipoPregunta(7)) {
      // y que mas le digo? xd
    }

    //si están hablando, callarlos
    if (this.artyom.isSpeaking()) {
      this.artyom.shutUp();
    }

    //Desactivar el reconocimiento de comandos cuando empiece la lectura
    this.artyom.dontObey();
    let local_artyom = this.artyom;
    this.artyom.say(reader, {
      onStart: function () {
      },
      onEnd: function () {
        //activar el reconocimiento de los comandos
        local_artyom.obey();
        console.log("vuelve a hablar");
      }
    });
  }

  decirAlgo(cadena: string): void {
    // prevenir habla
    if (!this.text2SpeakSupport()) {
      return;
    }
    //si están hablando, callarlos
    if (this.artyom.isSpeaking()) {
      this.artyom.shutUp();
    }

    //Desactivar el reconocimiento de comandos cuando empiece la lectura
    this.artyom.dontObey();
    let local_artyom = this.artyom;
    let loca_sweetFakeAlert = this.sweetFakeAlert;
    this.artyom.say(cadena, {
      onStart: function () {
      },
      onEnd: function () {
        //activar el reconocimiento de los comandos
        local_artyom.obey();
        if (loca_sweetFakeAlert[0]) {
          loca_sweetFakeAlert[0] = false;
        }
      }
    });
  }

  /*Operaciones en canvas*/

  public onoff: boolean;
  public firstLoc = {x: 0, y: 0};
  public lastLoc = {x: 0, y: 0};

  initCanvas(nuevo: boolean): void {
    console.log("canvas Element ", this.CanvasEl);
    console.log(this.CanvasEl.nativeElement);
    let mecanvas = this.CanvasEl.nativeElement;
    //this.contex = (this.CanvasEl.nativeElement as HTMLCanvasElement).getContext("2d");
    //this.contex = this.CanvasEl.nativeElement.getContext('2d');
    mecanvas.style['cursor'] = 'pointer';


    let c_tamanio = 85, c_margen = 10;
    if (this.questionObject.name_questioncategory == this.tipoPregunta(4)) {
      let parts_p_tmp: string[] = this.questionObject.answers_[0].complete_parts!;
      let parts_p: string[] = [];
      for (let ind = 0; ind < parts_p_tmp.length; ind++) {
        if (parts_p_tmp[ind] == "$option$") {
          parts_p.push(parts_p_tmp[ind]);
        }
      }
      let parts_o: Options[] = this.questionObject.answers_[0].options_answer[0].options!;
      let cantidad: number = parts_p.length > parts_o.length ? parts_p.length : parts_o.length;
      mecanvas.height = (c_tamanio * cantidad) + (c_margen * (cantidad - 1));
      mecanvas.width = (c_tamanio * 2) + 150;
      mecanvas.getContext('2d')!.clearRect(0, 0, mecanvas.width, mecanvas.height);
      let ctx = mecanvas.getContext('2d')!;
      let colorPan = ["#E3FFFF", "#BFFFC4", "#F6FFA1", "#C5AEFE", "#FDBDB1", "#BEACFF", "#E9CEBB", "#EFA0E7"];

      this.dibujaFilaItemsCanvas(ctx, c_tamanio, c_margen, cantidad, this.alphabet.slice(0, parts_p.length)
        , true, "-");
      this.dibujaFilaItemsCanvas(ctx, c_tamanio, c_margen, cantidad, parts_o
        , false, "+");
    } else if (this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
      let parts_o: OptionsAnswer[] = this.questionObject.answers_[0].options_answer;
      let cantidad: number = parts_o.length;
      mecanvas.height = (c_tamanio * cantidad) + (c_margen * (cantidad - 1));
      mecanvas.width = (c_tamanio * 2) + 150;
      mecanvas.getContext('2d')!.clearRect(0, 0, mecanvas.width, mecanvas.height);
      let ctx = mecanvas.getContext('2d')!;
      let colorPan = ["#E3FFFF", "#BFFFC4", "#F6FFA1", "#C5AEFE", "#FDBDB1", "#BEACFF", "#E9CEBB", "#EFA0E7"];

      this.dibujaFilaItemsCanvas(ctx, c_tamanio, c_margen, cantidad, parts_o
        , true, "-");
      this.dibujaFilaItemsCanvas(ctx, c_tamanio, c_margen, cantidad, parts_o
        , false, "+");
    } else {
      let cantidad: number = this.questionObject.answers_[0].options_answer.length;
      mecanvas.width = (c_tamanio * cantidad) + (c_margen * (cantidad - 1));
      mecanvas.getContext('2d')!.clearRect(0, 0, mecanvas.width, mecanvas.height);
      for (let ind = 0; ind < cantidad; ind++) {
        let img = new Image();
        img.onload = function () {
          img.width = 10;
          let ctx = mecanvas.getContext('2d')!;
          ctx.drawImage(img, (ind * c_tamanio) + (c_margen * ind), 5, c_tamanio, c_tamanio);
        };
        img.src = 'assets/imgresource/alfabeto/propio/' + this.alphabet[ind] + '.png';
      }
    }
    if (nuevo) {
      mecanvas.onmousedown = (e: {
        pageX: any; pageY: any; clientX: number; clientY: number;
      }) => {
        this.onoff = true;
        this.lastLoc = this.windowCanvas(e.clientX, e.clientY);
        this.firstLoc = this.windowCanvas(e.clientX, e.clientY);
        this.initCanvas(false);
      };
      mecanvas.onmousemove = (e: any) => {

        if (this.onoff) {
          let ctx = mecanvas.getContext('2d')!;
          var curLoc = this.windowCanvas(e.clientX, e.clientY);
          ctx.beginPath();
          ctx.moveTo(this.lastLoc.x, this.lastLoc.y);
          ctx.lineTo(curLoc.x, curLoc.y);
          ctx.strokeStyle = "rgba(0,0,0,0.25)";
          ctx.lineWidth = 10;
          ctx.lineCap = "round";
          ctx.stroke();
          this.lastLoc = curLoc;
        }
        //console.log("... Move onmousemove");
      }

      // The mouse click , Release , Move , Leave event execution
      mecanvas.onmouseup = (e: {
        preventDefault: () => void; pageX: any; pageY: any;
      }) => {
        this.onoff = false;
        let indice = Math.trunc((this.lastLoc.x) / (c_tamanio + c_margen));
        console.log(this.lastLoc.x, indice);
        let wildcard: string = this.alphabet[indice];

        if (this.questionObject.name_questioncategory == this.tipoPregunta(1) ||
          this.questionObject.name_questioncategory == this.tipoPregunta(2) ||
          this.questionObject.name_questioncategory == this.tipoPregunta(3)) {
          this.evaluarPreguntasSencillas(wildcard);
        } else if (this.questionObject.name_questioncategory == this.tipoPregunta(4) ||
          this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
          let mayor: number;
          let origen = -1, destino = -1;

          let cOp, cPr;

          if (this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
            cOp = this.questionObject.answers_[0].options_answer.length;
            cPr = this.questionObject.answers_[0].right_parts!.length;
            mayor = Math.max(cOp, cPr);
          } else if (this.questionObject.name_questioncategory == this.tipoPregunta(4)) {
            cOp = this.questionObject.answers_[0].options_answer[0].options!.length;
            cPr = this.questionObject.answers_[0].complete_parts!.length;
            mayor = Math.max(cOp, cPr);
          } else {
            cOp = 1;
            cPr = 1;
            mayor = 0;
          }

          let saltosBaseOp = (((mayor / cOp)));
          saltosBaseOp = (mayor == cOp) ? 0 : saltosBaseOp;
          let saltosBasePr = (((mayor / cPr)));
          saltosBasePr = (mayor == cPr) ? 0 : saltosBasePr;

          saltosBaseOp = mayor - cOp;
          saltosBasePr = mayor - cPr;
          console.log("paneles de mas: ", saltosBaseOp, saltosBasePr);


          let c_alto = c_tamanio;
          let literal = -1, opcion = -1;
          console.log("Saltos: ", saltosBaseOp, saltosBasePr);

          if (this.firstLoc.x < c_alto && this.lastLoc.x > c_alto + 150) {
            console.log("izquierda a derecha ");
            literal = Math.trunc((this.firstLoc.y) / (c_alto + c_margen));
            opcion = Math.trunc((this.lastLoc.y) / (c_alto + c_margen));
            literal = literal - 0;// (saltosBaseOp > 1 ? saltosBaseOp : 0);
            opcion = opcion - 0;//(saltosBasePr > 1 ? saltosBasePr : 0);
          } else if (this.lastLoc.x < c_alto && this.firstLoc.x > c_alto + 150) {
            console.log("derecha a izquierda ");
            literal = Math.trunc((this.lastLoc.y) / (c_alto + c_margen));
            opcion = Math.trunc((this.firstLoc.y) / (c_alto + c_margen));
            literal = literal - 0;// - saltosBaseOp;
            opcion = opcion - 0;// - (saltosBasePr > 1 ? saltosBasePr : 0);
          }
          console.log("Indices seleccionados 2: ", literal, opcion);
          if (literal != -1 && opcion != -1) {
            if (this.questionObject.name_questioncategory == this.tipoPregunta(4)) {
              //this.questionObject.answers_[0].complete_parts![opcion];
              //buscamos el indice al que se le debería ubicar el valor para que se presente
              //todo bien en la interfaz, una solución poco elegante pero válida
              let trueIndex = 0, count = -1;
              for (let ind = 0; ind < this.questionObject.answers_[0].complete_parts!.length; ind++) {
                if (this.questionObject.answers_[0].complete_parts![ind] == "$option$") {
                  trueIndex = ind;
                  count++;
                }
                if (count == literal) {
                  ind = this.questionObject.answers_[0].complete_parts!.length;
                }
              }
              this.questionObject.answers_[0].options_answer[0].response[trueIndex] = this.questionObject.answers_[0].options_answer[0].options[opcion];
              console.log("respuseta: ", this.questionObject.answers_[0].options_answer[0].response);
            } else if (this.questionObject.name_questioncategory == this.tipoPregunta(5)) {
              this.questionObject.answers_[0].responses[literal] = this.questionObject.answers_[0].right_parts![opcion];
            }
          }
        }
      }
      mecanvas.onmouseout = (e: {
        preventDefault: () => void;
      }) => {

        this.onoff = false;
      };
    }
  }

  //this.alphabet.subarray(parts.length);
  dibujaFilaItemsCanvas(ctx: CanvasRenderingContext2D, c_tamanio: number, c_margen: number, maxElements: number
    , parts: any[], isleft: boolean, subProperty: string, subPropertyImg: string = "-"): void {
    let colorPan = ["#E3FFFF", "#BFFFC4", "#F6FFA1", "#C5AEFE", "#FDBDB1", "#BEACFF", "#E9CEBB", "#EFA0E7"];
    //console.log("cantidades", maxElements, parts.length, (maxElements / parts.length));
    let saltosBase = (((maxElements / parts.length)) / 2);
    saltosBase = 0;//(maxElements == parts.length) ? 0 : saltosBase;
    //console.log("salto base:" + saltosBase);
    for (let ind = 0; ind < parts.length; ind++) {
      if (isleft) {
        ctx.fillStyle = colorPan[ind >= colorPan.length ? Math.trunc(ind / colorPan.length) : ind];
      } else {
        ctx.fillStyle = colorPan[colorPan.length - 1 - ind < 0 ? 0 : colorPan.length - ind - 1];
      }
      let tmp_y = 0;
      // if (ind == 0) {
      //   tmp_y = (maxElements / parts.length) + Math.trunc((c_tamanio / 2) + 7);
      // } else {
      tmp_y = ((saltosBase + ind) * c_tamanio) + ((saltosBase + ind) * c_margen);
      //console.log("cantidades", "((" + maxElements + " / " + parts.length + ") /" + 2 + " + " + ind + "- 0.5)", "= " + ((maxElements / parts.length) / 2 + ind - 0.5));
      // }
      ctx.fillRect(isleft ? Math.trunc(c_margen / 2) : (c_tamanio + 150), tmp_y, c_tamanio, c_tamanio);
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      ctx.font = "15px Arial";
      let lbl: string = "";
      if (subProperty == "-") {
        lbl = ("Literal " + this.alphabet[ind] + ".");
      } else if (subProperty == "+") {
        lbl = ("Opción " + this.alphabet[ind] + ".");
      } else {
        lbl = parts[ind][subProperty];
      }
      ctx.fillText(lbl,
        isleft ? (Math.trunc(c_margen / 2) + 7) : (c_tamanio + 150) + Math.trunc(c_margen / 2), tmp_y + Math.trunc((c_tamanio / 2) + 7));
      ctx.stroke();

      /*let imgTamanio = c_tamanio * 0.75;
      let img = new Image();
      img.onload = function () {
        img.width = 10;
        ctx.drawImage(img, (ind * c_tamanio) + (c_margen * ind), 5, c_tamanio * 0.75, c_tamanio);
      };
      img.src = 'assets/imgresource/alfabeto/propio/' + this.alphabet[ind] + '.png';*/

    }
  }

  /** *  obtain canvas coordinate  */
  windowCanvas(x: number, y: number) {
    let mecanvas = this.CanvasEl.nativeElement;
    var ctxbox = mecanvas.getBoundingClientRect();
    //console.log('canvas coordinate ', Math.round(x - ctxbox.left), Math.round(y - ctxbox.top));
    return {
      x: Math.round(x - ctxbox.left), y: Math.round(y - ctxbox.top)
    };
  }

  //###########################333

  // función
  enviarEvaluacion(): void {
    // ultima pregunta
    let [flagCorrect, points] = this.verificarRespuestasCorrectas(this.questionObject);
    this.questionObject.response_points = points;
    console.log(this.questionObject);
    this.showSwal(flagCorrect, this.indexQuestionObject);
    this.intentosEnvio++;
    this.questionObject.num_intentos = this.intentosEnvio;
    //valida ultima pregunta

    console.log(this.getCountReplied()[0] + '/' + this.getCountReplied()[1])
    if (this.getCountReplied()[0] === this.getCountReplied()[1]) {
      console.log("##########################################################################");
      console.log(this.evaluationObject);
      this.sweetFakeAlertFin = true;
      let urlServicio = this.utils.globalUrl + "personsevaluations/insertpersonsevaluations";
      let headers = new HttpHeaders()
        .set('Access-Control-Allow-Origin', '*')
        .set('provider', 'native')
        .set('token', this.loginservicie.getToken());
      console.log(this.evaluationObject);
      this._http.post<any>(urlServicio, {
        "result_evaluation": JSON.stringify(this.evaluationObject),
        "qualification_person_evaluation": this.calcularTotales(),
        "timespent_person_evaluation": this.calcularTiempos(),
        "evaluations_id_evaluation": this.idEvaluation,
      }, {headers: headers}).subscribe(response => {
      })
      this.sweetFakeAlertFin = false;
      this.utils.showMessages(2, "Se ha registrado la evaluación");
      this.router.navigateByUrl('/app/mycourse/modules/' + this.idCourse + '/themes/' + this.idModule + '/resources/' + this.idTopic);
    } else {
      this.utils.showMessages(3, "Faltan preguntas por resolver");
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

  clickDown(val: number): void {
    console.log("key", val, this.palabra.press === val);
    if (val !== undefined) {
      if (this.palabra.press === val) {
        this.palabra.press = -1;
      } else {
        this.palabra.press = val;
        this.palabra.release = -1;
        this.palabra.firstMovimiento++;
        /*if (this.palabra.firstMovimiento) {
          this.palabra.firstMovimiento = true;
        }*/
      }
    }
  }


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

/////////////////////////////////////////
// PREGUNTA DE UNIR CON LÍNEAS MEJORADA
/////////////////////////////////////////

// PREGUNTA DE UNIR CON LÍNEAS MEJORADA
  public joinLineDerecha: fabric.Circle[] = []
  public joinLineIzquierda: fabric.Circle[] = [];

  public globalUniLineaIndex = -1;
  public canvasLineas: fabric.Canvas;

  @ViewChild('canvasLineas', {static: true}) canvasElLineas: ElementRef<HTMLCanvasElement>;

  preguntaUnirConLinea(pregunta: any) {

    let c_tamanio = 100, c_margen = 5;
    let parts_o: OptionsAnswer[] = this.questionObject.answers_[0].options_answer;
    let cantidad: number = parts_o.length;
    let mecanvas = this.canvasElLineas.nativeElement;
    mecanvas.height = (c_tamanio * cantidad) + (c_margen * (cantidad - 1));
    // mecanvas.width = (c_tamanio * 2) + 150;
    mecanvas.getContext('2d')!.clearRect(0, 0, mecanvas.width, mecanvas.height);
    let ctx = mecanvas.getContext('2d')!;

    console.log("Pregunta de Unir Con Línea: ", pregunta);
    this.canvasLineas = new fabric.Canvas('canvasLineas', {
      backgroundColor: "white"
    });
    let canvasLineas = this.canvasLineas;
    canvasLineas.selection = false;
    /*canvasLineas.forEachObject(function(o:any){
      o.remove();
    })*/
    canvasLineas.clear();
    this.joinLineDerecha = [];
    this.joinLineIzquierda = [];
    console.log("ok", canvasLineas);

    for (let ind = 0; ind < pregunta.options_answer.length; ind++) {
      let labelL: string = pregunta.options_answer[ind].leftSide.length > 0 ?
        this.alphabet[ind] + ". " + pregunta.options_answer[ind].leftSide :
        "Literal " + this.alphabet[ind] + ".";
      this.makeElement(canvasLineas,
        labelL,
        pregunta.options_answer[ind].resourse_leftSide, 0, ind,
        pregunta.options_answer[ind].resourse_leftSide.length > 0);

      let labelR: string = pregunta.right_parts[ind].rightSide.length > 0 ?
        this.alphabet[ind] + ". " + pregunta.right_parts[ind].rightSide :
        "Opción " + this.alphabet[ind] + ".";
      this.makeElement(canvasLineas,
        labelR,
        pregunta.right_parts[ind].resourse_rightSide, 1, ind,
        pregunta.right_parts[ind].resourse_rightSide.length > 0);
    }
    for (let ind = 0; ind < this.joinLineIzquierda.length; ind++) {
      canvasLineas.bringToFront(this.joinLineIzquierda[ind]);
    }
    let joinLineElements = this.joinLineDerecha;
    let joinLineElementsIz = this.joinLineIzquierda;
    let globalUniLineaIndex = this.globalUniLineaIndex;
    let questionObject = this.questionObject;

    canvasLineas.on('object:moving', function (e) {
      let p = e.target;
      //console.log(p);
      // @ts-ignore
      p['line1'] && p['line1'].set({'x2': p.left + 6, 'y2': p.top + 6});
      canvasLineas.renderAll();
    });

    canvasLineas.on('mouse:down', function (e) {
      let p = e.target;
      console.log("me has clickeado tio", p);
      if (p != null) {
        for (let ind = 0; ind < joinLineElementsIz.length; ind++) {
          if (p!.intersectsWithObject(joinLineElementsIz[ind])) {
            console.log("Clic elemento: " + ind);
            globalUniLineaIndex = ind;
          }
        }
      }
    });

    canvasLineas.on('mouse:up', function (e) {
      let p = e.target;
      console.log("me has soltado tio", p);
      let inserTecta = false;
      if (p != null) {
        for (let ind = 0; ind < joinLineElements.length; ind++) {
          if (p!.intersectsWithObject(joinLineElements[ind])) {
            console.log("coindice con la posición: " + ind);
            inserTecta = true;
            if (globalUniLineaIndex != -1) {
              console.log("TOMAL: ", globalUniLineaIndex, ind, questionObject);
              questionObject.answers_[0].responses[globalUniLineaIndex] = questionObject.answers_[0].right_parts![ind];
              globalUniLineaIndex = -1;
            }
          }
        }
        if (inserTecta) {
          p!.set({'fill': 'blue'});
          canvasLineas.renderAll();
        } else {
          p!.set({'fill': 'white'});
          canvasLineas.renderAll();
        }
      }
    });
  }


  makeCircle(left: any, top: any, line1: any, line2: any, line3: any, line4: any) {
    let c = new fabric.Circle({
      left: left - 8,
      top: top - 8,
      strokeWidth: 2,
      radius: 12,
      fill: line1 == undefined ? '#fff' : 'gray',
      stroke: '#666',
      selectable: line1 == undefined ? false : true,
    });
    c.hasControls = c.hasBorders = false;
    // @ts-ignore
    c.line1 = line1;
    // @ts-ignore
    c.line2 = line2;
    // @ts-ignore
    c.line3 = line3;
    // @ts-ignore
    c.line4 = line4;

    return c;
  }

  makeLine(coords: number[]) {
    return new fabric.Line(coords, {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 6,
      selectable: false,
      evented: false,
    });
  }

  makeElement(canvasLineas: fabric.Canvas, text: any, image: any, numX: number, numY: number, recurso: boolean) {
    var rect = new fabric.Rect({
      left: numX * 450,
      top: numY * 105,
      fill: '#ffeaa7',
      width: (recurso ? 250 : 160),
      height: 100,
      evented: false,
      selectable: false
    });


    var txt = new fabric.Textbox(text, {
      left: (recurso ? 95 : 5) + (numX * 450),
      top: 5 + (numY * 105),
      fill: 'black',
      width: 150,
      fontSize: 14,
      evented: false,
      selectable: false
    });
    canvasLineas.add(rect);
    canvasLineas.add(txt);
    if (recurso) {
      fabric.Image.fromURL(image, function (img) {

        function determineNewHeight(originalHeight: number, originalWidth: number, newWidth: number) {
          return (originalHeight / originalWidth) * newWidth;
        }

        let local_width = 85, local_height = 85;
        // img['class'] = " img-size";
        if (img.width! > img.height!) {
          local_height = determineNewHeight(img.width!, img.height!, local_height);
        } else {
          local_width = determineNewHeight(img.height!, img.width!, local_width);
        }
        // img.set({
        //   scaleX: local_width / img.width!,
        //   scaleY: local_height / img.height!,
        //   originX: 'left', originY: 'top'
        // });
        const maxWidth = 85;
        const aspectRatio = img.width! / img.height!;
        const newWidth = Math.min(img.width!, maxWidth);
        const newHeight = newWidth / aspectRatio;

        // Establecer las nuevas dimensiones de la imagen
        img.set({
          // width: newWidth,
          // height: newHeight,
          scaleX: newWidth / img.width!,
          scaleY: newHeight / img.height!,
          originX: 'left', originY: 'top'
        });
        canvasLineas.add(img);
      }, {
        left: 5 + (numX * 450),
        top: 5 + (numY * 105),
        evented: false,
        selectable: false
      });
    }
    if (numX != 1) {
      let line = this.makeLine([
        //150 + 5 + 5 + 6
        (numX == 0 ? (recurso ? 250 - 3 : 160 - 3) : 450), (numY * 100) + 50 + (5 * numY) / 2,
        (numX == 0 ? (recurso ? 300 : 210) : 400), (numY * 100) + 50 + (5 * numY) / 2
      ]);
      canvasLineas.add(line);
      // @ts-ignore
      let circleInicio = this.makeCircle(line.get('x1'), line.get('y1'), null);
      canvasLineas.add(circleInicio);
      // @ts-ignore
      let circleFin = this.makeCircle(line.get('x2'), line.get('y2'), line);
      //circleFin.set({zIndex: (50 + numY)});
      canvasLineas.add(circleFin);
      this.joinLineIzquierda.push(circleFin);
    } else {
      // @ts-ignore
      let circle = this.makeCircle(450 - 10, (numY * 100) + 50 + (5 * numY) / 2, null);
      canvasLineas.add(circle);
      this.joinLineDerecha.push(circle);
    }
  }

}

