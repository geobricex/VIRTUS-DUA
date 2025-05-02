import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {Utils} from "../../util/Utils";
import {Person} from "../../models/Person";
import {ActivatedRoute} from "@angular/router";
import {LoginServicie} from "../loginServicie";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, AfterViewInit {
  globalUri: string | null = "";
  person: Person;
  persons: Person[];
  cols: any[];
  public dataReviews: any;
  idEvaPers: string | null = "";

  public alphabet: string[] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s",
    "t", "u", "v", "w", "x", "y", "z"
  ];

  constructor(private breadcrumbService: BreadcrumbService,
              private _http: HttpClient,
              private utils: Utils,
              private _route: ActivatedRoute,
              private loginservicie: LoginServicie) {
    this.idEvaPers = this._route.snapshot.paramMap.get("idReview");
    this.breadcrumbService.setItems([
      {label: 'Revisión de intento', routerLink: ['/app/reports/intentreview']},
      {label: '', routerLink: ['/app/']},
      {label: 'Revisión de intento', routerLink: ['/app/reports/intentreview']},
      {label: 'Detalle de evaluación', routerLink: ['/app/reports/intentreview/review/' + this.idEvaPers]},
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    if (this.idEvaPers != null) {
      this.loadgetReviews(this.idEvaPers)
    }
  }

  loadgetReviews(person_id_evaluation: any) {
    this.apiGetDataReview(4, person_id_evaluation).subscribe({
      next: response => {
        this.dataReviews = response.data[0];
        console.log(this.dataReviews);
      }
    })
  }

  apiGetDataReview(type: any, person_id_evaluation: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "personsevaluations/getpersonsevaluations";
    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    let queryParams = new HttpParams()
      .append("type", type)
      .append("id_evaluation", person_id_evaluation);
    return this._http.get<any>(this.globalUri, {params: queryParams, headers: headers});

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

  validarPreguntaRecurso(elemt: string): boolean {
    if (elemt != undefined && elemt != null)
      return (elemt.length > 0);
    return false;
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


  public btnVideoControl: any;

  initVideoControls(): void {
    this.btnVideoControl = document.querySelector("#pathurlvideo_question");
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

  showLetra(letra: string, indice: number, questionObject: any): string {
    if (letra === ' ')
      return 'space';
    if (questionObject.answers_[0].complete_parts![indice] == undefined)
      return 'void';
    else {
      return questionObject.answers_[0].complete_parts![indice];
    }
  }

  buscarLiteral(questionObject: any) {
    let index = -1;
    for (let ind = 0; ind < questionObject.answers_[0].options_answer.length; ind++) {
      if (JSON.stringify(questionObject.answers_[0].options_answer[ind]) ==
        JSON.stringify(questionObject.answers_[0].responses)) {
        index = ind;
      }
    }
    return index;
  }

  totalPuntos(): number {
    let max = 0;
    for (let ind = 0; ind < this.dataReviews.result_evaluation.questions_.length; ind++) {
      if (this.dataReviews.result_evaluation.questions_[ind].points_question)
        max += this.dataReviews.result_evaluation.questions_[ind].maximumpoints_question;
      // console.log(ind, ": =>", this.dataReviews.result_evaluation.questions_[ind].maximumpoints_question);
    }
    return max;
  }
}
