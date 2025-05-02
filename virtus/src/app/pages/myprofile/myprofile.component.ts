import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Person} from "../../models/Person";
import {Observable} from "rxjs";
import {Utils} from "../../util/Utils";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../models/user";
import {StorageService} from "../../authentication/StorageService";
import {Session} from "../../models/session";

import {FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, FormBuilder} from '@angular/forms';
import PocketBase from "pocketbase";
import {Message} from "primeng/api";
import {BreadcrumbService} from "../../app.breadcrumb.service";
import {LoginServicie} from "../loginServicie";

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})

export class MyprofileComponent implements OnInit, AfterViewInit {

  person: Person;
  public session: Session;
  globalUri: string = "";
  editar_datos: boolean;
  formUpdatePhto: boolean;
  formUpdatePass: boolean;

  tmpFile: any;
  client: any;
  urlimageupload: any;
  insertarPocket = false;

  msgs: Message[] = [];
  frmCambioContrasena: FormGroup; // Define el FormGroup para el formulario

  frmPhoto = new FormGroup({
    firstName: new FormControl()
  });

  constructor(
    private breadcrumbService: BreadcrumbService,
    private utils: Utils,
    private _http: HttpClient,
    private storageService: StorageService,
    private fb: FormBuilder,
    private loginservicie: LoginServicie
  ) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app/']},
      {label: 'Perfil', routerLink: ['/app/myprofile']},
    ]);

  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.session = this.storageService.getCurrentSession();
    this.editar_datos = false;
    this.formUpdatePhto = false;
    // https://aplicaciones.uteq.edu.ec/pocketbase
    this.client = new PocketBase("https://fyc.uteq.edu.ec/pocketbase");
    let resp = this.initPocket();
    console.log(resp);
    console.log(this.session.token);
    this.apiGetPerson().subscribe(response => {
      console.log(response)
      this.person = new Person(response.id, response.namePerson, response.lastnamePerson,
        response.emailPerson, response.typePerson, response.pathimgPerson, response.codeverificationPerson, response.dateregPerson,
        response.dateupdatePerson, response.providerPerson, response.idLocation);
      this.person._passwordPerson = response.passwordPerson;
    });

    this.frmCambioContrasena = this.fb.group({
      contrasenaAnterior: ['', Validators.required],
      nuevaContrasena: ['', Validators.required],
      confirmarNuevaContrasena: ['', Validators.required],
    });
  }

  loadAvatarsProfile() {

  }

  showUpdatePhoto() {
    this.formUpdatePhto = true;
    this.urlimageupload = this.person._pathimgPerson;
  }

  initPocket(): Observable<any> {
    return this.client.Admins.authViaEmail("anthony.pachay2017@uteq.edu.ec", "Abc1234567");
  }

  apiGetPerson(): Observable<any> {
    this.globalUri = this.utils.globalUrl + "persons/getperson";

    return this._http.post(this.globalUri, {
      "sessionToken": this.loginservicie.getToken(),
    },);
  }

  updateDataPerson() {
    console.log(this.person);
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Virtus', detail: 'Procesando...'});
    this.apiupdateDataPerson(this.person).subscribe(response => {
      this.msgs = [];
      this.utils.showMessages(2, "Datos actualizados exitosamente.", "tst");
      this.editar_datos = false;
      this.utils.showMessages(3, "Para ver los cambios, recargue la página.", "tst");
    });
  }

  apiupdateDataPerson(person: Person): Observable<any> {
    this.globalUri = this.utils.globalUrl + "persons";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.put<Person>(this.globalUri, person, {headers: headers});
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
      this.insertarPocket = true;
    }
  }

  updatePhtoProfile() {
    this.utils.loading;
    if (this.insertarPocket) {
      this.changeImage().then(response => {
        this.person._pathimgPerson = this.makePathRecurso(response);
        this.apiupdateDataPerson(this.person).subscribe(response => {
          this.utils.showMessages(2, "Foto de perfil actualizada exitosamente.", "tst");
          this.editar_datos = false;
          this.formUpdatePhto = false;
          this.utils.closeLoading;
        });
      });
    } else {
      console.log("sin pocket !");
      this.person._pathimgPerson = this.urlimageupload;
      this.apiupdateDataPerson(this.person).subscribe(response => {
        this.utils.showMessages(2, "Foto de perfil actualizada exitosamente. Los cambios se visualizaran despues de volver a iniciar sesión.", "tst");
        this.editar_datos = false;
        this.formUpdatePhto = false;
        this.utils.closeLoading;
      });
    }
  }

  async changeImage(): Promise<any> {
    let formData01 = new FormData();
    formData01.append('field', this.tmpFile);
    //console.log("test02", typeof (this.tmpFile), this.tmpFile);
    return await this.client.Records.create("archivos", formData01);
  }

  makePathRecurso(element: any): string {
    var urlRecurso: string = "https://fyc.uteq.edu.ec/pocketbase" + "/api/files/" + element["@collectionName"] + "/" + element.id + "/" + element.field;// +"/" ;
    return urlRecurso;
  }

  seleccionarAvatar(avatar: any): any {
    this.insertarPocket = false;
    this.urlimageupload = avatar.image;
  }

  modalformUpdatePass() {
    this.formUpdatePhto = false; // Oculta cualquier otro formulario que esté abierto
    this.formUpdatePass = true;
  }

  cambiarContrasena(): void {

    const confirmarNuevaContrasenaControl = this.frmCambioContrasena.get('confirmarNuevaContrasena');
    const contrasenaAnteriorControl = this.frmCambioContrasena.get('contrasenaAnterior');
    const nuevaContrasenaControl = this.frmCambioContrasena.get('nuevaContrasena');

    if (confirmarNuevaContrasenaControl && contrasenaAnteriorControl && nuevaContrasenaControl) {
      const contrasenaAnterior = contrasenaAnteriorControl.value;
      const confirmarNuevaContrasena = confirmarNuevaContrasenaControl.value;
      const nuevaContrasena = nuevaContrasenaControl.value;
      if (nuevaContrasena === confirmarNuevaContrasena) {

        const requestData = {
          password: contrasenaAnterior,
          newpassword: nuevaContrasena
        };

        const jsonRequestData = JSON.stringify(requestData);

        this.apiupdatePassPerson(jsonRequestData).subscribe(response => {
          console.log(response)
          if (response.status === 2) {
            this.utils.showMessages(2, "La contraseña ha sido actualizada.", "tst");
            this.frmCambioContrasena.reset();
            this.formUpdatePass = false;
            this.utils.closeLoading;
          } else if (response.status === 5) {
            this.utils.showMessages(3, "Contraseña incorrecta", "tst");
          } else {
            this.utils.showMessages(4, response.information, "tst");
          }

        });


      } else {
        this.utils.showMessages(3, "La nueva contraseña y la confirmación no coinciden. No se pudo cambiar la contraseña.", "tst");

      }
    }
  }

  apiupdatePassPerson(jsonData: String): Observable<any> {
    this.globalUri = this.utils.globalUrl + "persons/changepassword";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    return this._http.post<Person>(this.globalUri, jsonData, {headers: headers});
  }

  //ANEXO
  avatar: any [] = [
    {
      name: "paloma",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/c4TI0hFWchjzlFjDjNb6hp8JpXw0tAmM.png",//paloma
    },
    {
      name: "elefante",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/MmEcidSf5cTgdRV1AtLGN4Pi4sO9nWfD.png",//elefante
    },
    {
      name: "morza",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/q0XEor2cF2h4GrsloT7xTAHgNEaY8jae.png",//morza
    },
    {
      name: "tigre",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/r08Xf0mYdLuz1OFQXPMj3ZmG6uwM4aXa.png",//tigre
    },
    {
      name: "vaca",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/9rrUuGVG4ep8QejNlOhQfoqkqki3ZK2P.png",//vaca
    },
    {
      name: "alce",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/WAVkyXYIZpdA93VIkJhh327tp3uM4jxA.png",//alce
    },
    {
      name: "caballo",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/RBSr3TFTj29AAjPD1qfXGFpnOPoZoAl4.png",//caballo
    },
    {
      name: "cabra",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/hkWhaLgyTjxCWEYbIZ5DJAhIP48VbIcT.png",//cabra
    },
    {
      name: "rinoceronte",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/ptIWCVQELOYS2mV3DQXc8pOdbe8m5RPc.png",//rinoceronte
    },
    {
      name: "venado",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/HcS5vleLE5OXhOx1yOi95WPgF0rVPlnc.png",//venado
    },
    {
      name: "gorila",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/bI3UnrRJABu12q8pzswAuMtM0oDT7zhZ.png",//gorila
    },
    {
      name: "hipopótamo",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/SnzOlBKapg5MIxrhPC8VS0tldIlQ8GL0.png",//hipopótamo
    },
    {
      name: "cerdo",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/8nKZ5siKeLvAFu6uRojMIxTFhQx8HLXW.png",//cerdo
    },
    {
      name: "gato",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/EzRB3YSZVicus7CU2U8xxCW1ZS8tYa2G.png",//gato
    },
    {
      name: "zorro",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/xVAR5UMUVuHAtRJnctRSJIIWHF00egRL.png",//zorro
    },
    {
      name: "jirafa",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/hrOSvnw3MulIO4HHgMRZd3fQ4meS5bMK.png",//jirafa
    },
    {
      name: "león",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/EVsyS8Xq8Jwlq5dieuAIuSBdu2vXE5g3.png",//león
    },
    {
      name: "conejo",
      image: "https://fyc.uteq.edu.ec/pocketbase/api/files/vhcVv4ysYudB08r/XrTv4ARtJ14N9rn/mBnytNCGmR2vzJxLX5lfts7wRpOSH6QA.png"//conejo
    },
  ];
}
