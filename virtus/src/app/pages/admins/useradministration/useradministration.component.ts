import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../../app.breadcrumb.service";
import {ConfirmationService, Message, MessageService} from "primeng/api";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../../../util/Utils";
import {Person} from "../../../models/Person";
import {User} from "../../../models/user";
import {StorageService} from "../../../authentication/StorageService";
import {Session} from "../../../models/session";
import {LoginServicie} from "../../loginServicie";
import {Router} from "@angular/router";
import {PersonInterface} from "../../../models/PersonInterface";

@Component({
  selector: 'app-useradministration',
  templateUrl: './useradministration.component.html',
  styleUrls: ['./useradministration.component.scss']
})
export class UseradministrationComponent implements OnInit, AfterViewInit {

  globalUri: string | null = "";
  person: Person;
  persons: Person[];
  public personUser: PersonInterface;
  cols: any[];
  msgs: Message[] = [];
  public user: User;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private _http: HttpClient,
    private utils: Utils,
    private storageService: StorageService,
    private loginservicie: LoginServicie,
    public router: Router,
  ) {

    this.breadcrumbService.setItems([
      {label: 'Gestión de Usuario', routerLink: ['/app/useradministration']},
    ]);
  }
  ngAfterViewInit() {
    console.clear();
  }
  ngOnInit(): void {
    // console.log(this.loginservicie.getToken());
    this.loadgetPersons();
    this.getDataUser()
    this.cols = [
      {field: 'Nombre', header: 'Nombre'},
      {field: 'Apellido', header: 'Apellido'},
      {field: 'Email', header: 'Email'},
      {field: 'Tipodeusuario', header: 'Tipo de usuario'},
      {field: 'Tipoderegistro', header: 'Tipo de registro'}
    ];
  }

  getDataUser() {
    this.loginservicie.getDataPerson(this.loginservicie.getToken()).subscribe({
      next: response => {
        //console.log(response);
        this.personUser = response;
        console.log(" this.person")
        console.log(this.personUser)
        if (this.personUser === null) {
          this.router.navigateByUrl('/login');
          return;
        }
      }, error: err => {
        this.router.navigateByUrl('/login');
      }
    });
  }

  loadgetPersons() {
    // console.log(this.user)
    this.apiLoadGetPersons().subscribe(response => {
      this.persons = response.data;
      // console.log(response);
    });
  }

  apiLoadGetPersons(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "persons/personsget";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post(this.globalUri, {}, {headers: headers});
  }

  changeRolPersons(personUpdate: Person, type: string | null) {
    // console.log("type " + type);
    switch (type) {
      case "UtoA":
        type = "A"
        break;
      case "AtoU":
        type = "U";
        break;
      case "UtoD":
        type = "D";
        break;
      case "StoU":
        type = "U";
        break;
      default:
        type = "D";
        break;
    }
    //2020-12-31T15:53:16.45  - 2022-8-31T23:9:34.00
    // // @ts-ignore
    // let dateupdatePerson: string = personUpdate.dateupdatePerson['date'].year + '-' + personUpdate.dateupdatePerson['date'].month + '-' + personUpdate.dateupdatePerson['date'].day + ' ' + personUpdate.dateupdatePerson['time'].hour + ':' + personUpdate.dateupdatePerson['time'].minute + ':' + personUpdate.dateupdatePerson['time'].second + '.00';

    // @ts-ignore
    // let dateregPerson: string = personUpdate.dateregPerson['date'].year + '-' +
    // // @ts-ignore
    // personUpdate.dateregPerson['date'].month > 10 ? personUpdate.dateregPerson['date'].month : '0' + personUpdate.dateregPerson['date'].month + '-' +
    // // @ts-ignore
    // personUpdate.dateregPerson['date'].day > 10 ? personUpdate.dateregPerson['date'].day : '0' + personUpdate.dateregPerson['date'].day + ' ' +
    // // @ts-ignore
    // personUpdate.dateregPerson['time'].hour > 10 ? personUpdate.dateregPerson['time'].hour : '0' + personUpdate.dateregPerson['time'].hour + ':' +
    // // @ts-ignore
    // personUpdate.dateregPerson['time'].minute > 10 ? personUpdate.dateregPerson['time'].minute : '0' + personUpdate.dateregPerson['time'].minute + ':' +
    // // @ts-ignore
    // personUpdate.dateregPerson['time'].second > 10 ? personUpdate.dateregPerson['time'].second : '0' + personUpdate.dateregPerson['time'].second;
    // // // @ts-ignore
    // personUpdate.dateupdatePerson = '';
    // @ts-ignore
    // personUpdate.dateregPerson = '';
    // @ts-ignore
    personUpdate.typePerson = type;
    // // @ts-ignore
    // personUpdate.dateupdatePerson = dateupdatePerson;
    // @ts-ignore
    // personUpdate.dateregPerson = dateregPerson;
    // console.log(personUpdate);
    // @ts-ignore
    // let personFinal =  new Person(personUpdate.id, personUpdate.namePerson, personUpdate.lastnamePerson, personUpdate.emailPerson, personUpdate.typePerson, personUpdate.pathimgPerson, personUpdate.codeverificationPerson, personUpdate.dateregPerson, personUpdate.dateupdatePerson, personUpdate.providerPerson, personUpdate.idLocation);

    // console.log(personUpdate);
    // @ts-ignore
    personUpdate.dateregPerson = (personUpdate.dateregPerson).replace("T", " ");
    // @ts-ignore
    personUpdate.dateupdatePerson = (personUpdate.dateupdatePerson).replace("T", " ");

    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Virtus', detail: 'Procesando...'});

    this.apiChangeRolPersons(personUpdate).subscribe(response => {
      // this.persons = response.data;
      // console.log(response);
      this.msgs = [];
      this.utils.showMessages(2, "Datos actualizados exitosamente.", "tst");
      // this.loadgetPersons();
    });
  }

  apiChangeRolPersons(person: Person): Observable<any> {
    console.log(person);
    console.log(this.loginservicie.getToken())
    this.globalUri = this.utils.globalUrl + "persons";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('token', this.loginservicie.getToken());
    return this._http.put<Person>(this.globalUri, person, {headers: headers});
  }

}
