import {Injectable} from "@angular/core";
import {MessageService} from "primeng/api";
import {Observable} from "rxjs";
import PocketBase from "pocketbase";
import {StorageService} from "../authentication/StorageService";
import Swal from 'sweetalert2'
import {LoginServicie} from "../pages/loginServicie";

@Injectable()
export class Utils {

  client: any;
  private _token: string = "";
  private _globalUrl: string = "";
  private loginServicie: LoginServicie;


  constructor(private service: MessageService, private storageService: StorageService) {
    this.validateHost();
    //this._token = this.loginservicie.getToken();
    console.log("login servicie: ", this._token);
  }

  get loading() {
    return Swal.fire({
      width: 300,
      html:
        '<img src="assets/layout/images/imagesVirtus/loding.gif" alt="" width="150" style="filter: none;"> <br>' +
        '<span> Cargando... </span>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false
    });
  }

  get closeLoading() {
    return Swal.close();
  }

  onImgError(event: any) {
    event.target.src = 'assets/layout/images/imagesVirtus/logoSolo.svg'
//Do other stuff with the event.target
  }

  getUserSession() {
    return this.storageService.getCurrentSession().user;
  }

  showMessages(status: number, info: string, key: string = "grow_glb") {
    this.service.add({
      key: key,
      severity: status === 1 ? "info" : status === 2 ? "success" : status === 3 ? "warn" : "error",
      summary: status === 1 ? "Notificación" : status === 2 ? "Éxito" : status === 3 ? "Alerta" : "Error",
      detail: info
    });
  }

  initPocket() {
    // this.client = new PocketBase("https://aplicaciones.uteq.edu.ec:9549");
    this.client = new PocketBase("https://fyc.uteq.edu.ec/pocketbase");
    this.client.Admins.authViaEmail("anthony.pachay2017@uteq.edu.ec", "Abc1234567");
  }

  async changeImage(tmpFile: any): Promise<any> {
    let formData01 = new FormData();
    formData01.append('field', tmpFile);
    //console.log("test02", typeof (this.tmpFile), this.tmpFile);
    return await this.client.Records.create("archivos", formData01);
  }

  makePathRecurso(element: any): string {
    var urlRecurso: string = "https://fyc.uteq.edu.ec/pocketbase" + "/api/files/" + element["@collectionName"] + "/" + element.id + "/" + element.field;// +"/" ;
    // var urlRecurso: string = "https://aplicaciones.uteq.edu.ec:9549" + "/api/files/" + element["@collectionName"] + "/" + element.id + "/" + element.field;// +"/" ;
    return urlRecurso;
  }

  validateHost() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      this._globalUrl = "virtus_bk/";
    } else {
      // this._globalUrl = "virtus_bk/";
      this._globalUrl = "virtusbk/";
    }
  }

  get globalUrl(): string {
    return this._globalUrl;
  }

  set globalUrl(value: string) {
    this._globalUrl = value;
  }


  get token(): string {
    this._token = this.loginServicie.getToken();
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }
}
