import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../../app.breadcrumb.service";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Utils} from "../../../util/Utils";
import {Course} from "../../../models/Course";
import {LoginServicie} from "../../loginServicie";

@Component({
  selector: 'app-timereport',
  templateUrl: './timereport.component.html',
  styleUrls: ['./timereport.component.scss']
})
export class TimereportComponent implements OnInit, AfterViewInit {
  dataReviews: any;
  globalUri: string | null = "";

  /*Gráfica*/
  lineData: any;
  barData: any;
  pieData: any;
  polarData: any;
  radarData: any;
  lineOptions: any;
  barOptions: any;
  pieOptions: any;
  polarOptions: any;
  radarOptions: any;

  selectedCourse: string;
  courses: Course[];
  statusApi: number = 0;
  timespent_person_evaluation: number[] = [];
  qualification_person_evaluation: number[] = [];
  name_evaluation: string[] = [];

  constructor(private breadcrumbService: BreadcrumbService,
              private _http: HttpClient,
              private utils: Utils,
              private loginservicie: LoginServicie
  ) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/']},
      {label: 'Revisión de Reportes', routerLink: ['/app/reports/timereport']},
    ]);

  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit() {
    this.loadMyCourse();
  }

  chartCourse(value: any) {
    console.log(value)
    this.loadgetReviews(5, value);
  }

  loadgetReviews(type: number, param: number) {
    this.apiGetDataReview(type, param).subscribe({
      next: response => {
        this.dataReviews = response.data;
        console.log(this.dataReviews);
        this.timespent_person_evaluation = [];
        this.qualification_person_evaluation = [];
        this.name_evaluation = [];
        this.viewBarReport();
        this.viewGeneralReport();
      }
    })
  }

  apiGetDataReview(type: number, param: number): Observable<any> {
    this.globalUri = this.utils.globalUrl + "personsevaluations/getpersonsevaluations";
    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    let queryParams = new HttpParams()
      .append("type", type)
      .append("id_evaluation", param);
    return this._http.get<any>(this.globalUri, {params: queryParams, headers: headers});

  }

  viewBarReport() {
    for (let i = 0; i < this.dataReviews.length; i++) {
      if (this.dataReviews[i].type_evaluation == 1) {
        console.log(this.dataReviews[i].timespent_person_evaluation)
        console.log((this.dataReviews[i].timeminutes_evaluation) + "-" + (this.dataReviews[i].timespent_person_evaluation / 60))
        this.timespent_person_evaluation[i] = (this.dataReviews[i].timeminutes_evaluation) - (this.dataReviews[i].timespent_person_evaluation / 60);

      } else if (this.dataReviews[i].type_evaluation == 2) {
        this.timespent_person_evaluation[i] = this.dataReviews[i].timespent_person_evaluation;
      }
      this.qualification_person_evaluation[i] = this.dataReviews[i].qualification_person_evaluation;
      this.name_evaluation[i] = (this.dataReviews[i].name_evaluation + "-" + this.dataReviews[i].name_course);
    }

    this.barData = {
      labels: this.name_evaluation,
      datasets: [
        {
          label: 'Promedio de Tiempo empleado (minutos)',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: this.timespent_person_evaluation
        },
        {
          label: 'Promedio de Puntaje obetenido',
          backgroundColor: 'rgb(92,88,220)',
          borderColor: 'rgb(3,38,133)',
          data: this.qualification_person_evaluation
        }
      ]
    };

    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#000000'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            fontColor: '#000000'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
        y: {
          ticks: {
            fontColor: '#000000'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
      }
    };
  }

  viewGeneralReport() {
    for (let i = 0; i < this.dataReviews.length; i++) {
      if (this.dataReviews[i].type_evaluation == 1) {
        console.log(this.dataReviews[i].timespent_person_evaluation)
        console.log((this.dataReviews[i].timeminutes_evaluation) + "-" + (this.dataReviews[i].timespent_person_evaluation / 60))
        this.timespent_person_evaluation[i] = (this.dataReviews[i].timeminutes_evaluation) - (this.dataReviews[i].timespent_person_evaluation / 60);

      } else if (this.dataReviews[i].type_evaluation == 2) {
        this.timespent_person_evaluation[i] = this.dataReviews[i].timespent_person_evaluation;
      }
      this.qualification_person_evaluation[i] = this.dataReviews[i].qualification_person_evaluation;
      this.name_evaluation[i] = (this.dataReviews[i].name_evaluation + "-" + this.dataReviews[i].name_course);
    }


    this.lineData = {
      labels: this.name_evaluation,
      datasets: [
        {
          label: 'Promedio de Tiempo obtenido',
          data: this.timespent_person_evaluation,
          fill: false,
          backgroundColor: 'rgb(255, 205, 86)',
          borderColor: 'rgb(255, 205, 86)',
          // pointBorderColor: "#000000",
          tension: .9
        },
        {
          label: 'Promedio de Puntaje obetenido',
          data: this.qualification_person_evaluation,
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: "#000000",
          tension: 0.9
        }
      ]
    };

    this.lineOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#000000'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            fontColor: '#000000'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
        y: {
          ticks: {
            fontColor: '#000000'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
      }
    };

    this.pieData = {
      labels: this.name_evaluation,
      datasets: [
        {
          data: this.qualification_person_evaluation,
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)'
          ]
        }]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#000000'
          }
        }
      }
    };

    this.polarData = {
      datasets: [{
        data: this.timespent_person_evaluation,
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)'
        ],
        label: 'Promedio de tiempo empleado (min)'
      }],
      labels:
      this.name_evaluation
    };

    this.polarOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#000000'
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: 'rgba(160, 167, 181, .3)'
          }
        }
      }
    };

    this.radarData = {
      labels: this.name_evaluation,
      datasets: [
        {
          label: 'Promedio de tiempo empleado (min)',
          backgroundColor: 'rgba(54, 162, 235,0.2)',
          borderColor: 'rgba(54, 162, 235,1)',
          pointBackgroundColor: 'rgba(54, 162, 235,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235,1)',
          data: this.timespent_person_evaluation
        },
        {
          label: 'Promedio de Puntaje obetenido',
          backgroundColor: 'rgba(255, 99, 132,0.2)',
          borderColor: 'rgba(255, 99, 132,1)',
          pointBackgroundColor: 'rgba(255, 99, 132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 99, 132,1)',
          data: this.qualification_person_evaluation
        }
      ]
    };

    this.radarOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#000000'
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: 'rgba(160, 167, 181, .3)'
          }
        }
      }
    };
  }

  auxPrimaryValue: number;

  loadMyCourse() {
    this.apiLoadMyCourse()
      .subscribe(
        {
          next: response => {
            console.log(response);
            this.statusApi = response.status;
            if (response.status === 2) {
              this.courses = response.data;

              this.auxPrimaryValue = response.data[0].id_course
              console.log(this.auxPrimaryValue)
              this.loadgetReviews(5, this.auxPrimaryValue);

            }
          }
          , error: err => {
            console.log(err);
            console.log("Error interno de servidor");
          }
        });
  }

  apiLoadMyCourse(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "personscours/mycoursejoin";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, {state_course_person: "A"}, {headers: headers});
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
}
