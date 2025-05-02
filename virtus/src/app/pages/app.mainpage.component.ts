import {AfterViewInit, Component, OnInit} from '@angular/core';
//import { DomSanitizer } from '@angular/platform-browser';
import {CargarScriptsService} from "../services/cargar-scripts.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Utils} from "../util/Utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.pagemain.component.html',
  styleUrls: ['./app.pagemain.component.css']
})
export class AppMainpageComponent {
  // title = 'dinamic-styles';
  // cssUrl: string;
  totalVisits: number = 0;
  globalUri: string = "";
  cantVisitValue: number | undefined; // Variable para almacenar el valor de cant_visit

  constructor(private _CargarScriptsService: CargarScriptsService
    , private http: HttpClient
    , private utils: Utils,
              /*public sanitizer: DomSanitizer*/) {
    // this.cssUrl = './app.pagemain.component.css';
    _CargarScriptsService.loadingService(["https://res.cloudinary.com/bricex/raw/upload/v1657340119/library/mainpage.js"]);
    //_CargarScriptsService.loadingService(["../assets/scripts/library/artyom.window.min.js"]);
    //_CargarScriptsService.loadingService(["../assets/scripts/js/manager_voice.js"]);
    /*_CargarScriptsService.loadingService([
      "https://res.cloudinary.com/bricex/raw/upload/v1657504142/library/artyom.window.min.js",//"../assets/scripts/library/artyom.window.min.js",
      "https://res.cloudinary.com/bricex/raw/upload/v1657504244/library/manager_voice.js"//"../assets/scripts/js/manager_voice.js"
    ]);*/
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.countVitit();
    //   // Configura la URL de la API de Reporting de Google Analytics
    //   const apiUrl = 'https://analyticsreporting.googleapis.com/v4/reports:batchGet';
    //
    //   // Configura los parámetros de consulta
    //   const requestBody = {
    //     reportRequests: [
    //       {
    //         viewId: '6066095251', // Reemplaza con el ID de la vista de virtus
    //         dateRanges: [{startDate: '2023-01-01', endDate: 'today'}], // Puedes ajustar el rango de fechas
    //         metrics: [{expression: 'ga:sessions'}] // Métrica para el número total de sesiones (visitas)
    //       }
    //     ]
    //   };
    //
    //   // Configura las cabeceras de autenticación
    //   const headers = new HttpHeaders({
    //     'Authorization': 'Bearer http://1019537813978-u6s2ep8bnqlmeajmsgqv8aikb76hr0gv.apps.googleusercontent.com' // Reemplaza con tu token de acceso
    //   });
    //
    //   // Realiza la solicitud a la API de Reporting de Google Analytics
    //   this.http.post(apiUrl, requestBody, {headers: headers})
    //     .subscribe((data: any) => {
    //       // Suponiendo que la respuesta contiene el número total de sesiones
    //       if (data.reports && data.reports.length > 0) {
    //         this.totalVisits = data.reports[0].data.totals[0].values[0];
    //       }
    //     });
    //
    //   console.log(this.totalVisits);
  }

  countVitit() {
    this.apicountVisit().subscribe(response => {
      if (response.status === 2) {
        this.cantVisitValue = response.data[0].cant_visit;
      }
    });
  }

  apicountVisit(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "utils/countvisit";
    return this.http.get(this.globalUri, {});
  }

}
