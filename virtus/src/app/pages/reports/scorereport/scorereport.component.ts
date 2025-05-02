import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../../app.breadcrumb.service";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Utils} from "../../../util/Utils";
import {LoginServicie} from "../../loginServicie";

@Component({
  selector: 'app-scorereport',
  templateUrl: './scorereport.component.html',
  styleUrls: ['./scorereport.component.scss']
})
export class ScorereportComponent implements OnInit, AfterViewInit {
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

  constructor(private breadcrumbService: BreadcrumbService,
              private _http: HttpClient,
              private utils: Utils,
              private loginservicie: LoginServicie
  ) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/']},
      {label: 'Reporte de puntaje', routerLink: ['/app/reports/scorereport']},
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit() {
    this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: 'rgb(255, 205, 86)',
          borderColor: 'rgb(255, 205, 86)',
          tension: .4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgb(75, 192, 192)',
          tension: .4
        }
      ]
    };

    this.lineOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#A0A7B5'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#A0A7B5'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
        y: {
          ticks: {
            color: '#A0A7B5'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
      }
    };

    this.barData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#A0A7B5'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#A0A7B5'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
        y: {
          ticks: {
            color: '#A0A7B5'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
      }
    };

    this.pieData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702, 421],
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
            fontColor: '#A0A7B5'
          }
        }
      }
    };

    this.polarData = {
      datasets: [{
        data: [
          11,
          16,
          7,
          3
        ],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)'
        ],
        label: 'My dataset'
      }],
      labels: [
        'Blue',
        'Purple',
        'Orange',
        'Green'
      ]
    };

    this.polarOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#A0A7B5'
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
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(54, 162, 235,0.2)',
          borderColor: 'rgba(54, 162, 235,1)',
          pointBackgroundColor: 'rgba(54, 162, 235,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235,1)',
          data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: 'rgba(255, 99, 132,0.2)',
          borderColor: 'rgba(255, 99, 132,1)',
          pointBackgroundColor: 'rgba(255, 99, 132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 99, 132,1)',
          data: [28, 48, 40, 19, 96, 27, 100]
        }
      ]
    };

    this.radarOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: '#A0A7B5'
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

  loadgetReviews() {
    console.log("DATA EVALUATION")
    this.apiGetDataReview(3).subscribe({
      next: response => {
        this.dataReviews = response.data;
        console.log(this.dataReviews);
      }
    })
  }

  apiGetDataReview(type: any): Observable<any> {
    this.globalUri = this.utils.globalUrl + "personsevaluations/getpersonsevaluations";
    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    let queryParams = new HttpParams()
      .append("type", type)
      .append("id_evaluation", 0);
    return this._http.get<any>(this.globalUri, {params: queryParams, headers: headers});

  }
}
