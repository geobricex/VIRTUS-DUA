import {Component} from '@angular/core';
import {User} from '../models/user';
import {Session} from '../models/session';
import {Router} from '@angular/router';
import {StorageService} from "../authentication/StorageService";
import {Utils} from "../util/Utils";
// web servicies cliet
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import PocketBase from 'pocketbase';
import {Person} from "../models/Person";
import {MessageService} from "primeng/api";

import {initializeApp} from "firebase/app";
import * as auth from 'firebase/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Parser} from "@angular/compiler";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {LoginServicie} from "./loginServicie";
import {AppComponent} from "../app.component";

@Component({
    selector: 'app-login',
    templateUrl: './app.login.component.html',
    styleUrls: ['./app.login.component.css']
})
export class AppLoginComponent {

    user: User;
    sessionLog: Session;
    forgotPassword_dialog: boolean;
    alreadyHasCode: boolean;
    globalUri: string = "";
    frmLogin: FormGroup;

    user_rec: string = "";
    code_rec: string = "";
    password_rec: string = "";
    password_conf_rec: string = "";

    constructor(
        public router: Router,
        private storageService: StorageService,
        private _http: HttpClient,
        private service: MessageService,
        public fAuth: AngularFireAuth,
        private formBuilder: FormBuilder,
        private cookies: CookieService,
        private utils: Utils,
        private loginservicie: LoginServicie,
        private appComp: AppComponent
    ) {
        this.forgotPassword_dialog = false;
        this.alreadyHasCode = false;
    }

    ngAfterViewInit() {
        console.clear();
        this.appComp.reiniciarConfiguracion();
    }

    /**
     * Metodo para inicializar cualquier cosa
     * */
    ngOnInit(): void {
        //this.storageService.logout();
        //localStorage.clear()
        //sessionStorage.clear()
        this.sessionLog = new Session("", new User("", "", "", "", "", ""));
        this.user = new User("", "", "", "", "", "");
        this.frmLogin = this.formBuilder.group({
            email: ["", Validators.required],
            password: ["", Validators.required],
        });
    }


    get form() {
        return this.frmLogin.controls;
    }

    openDialogHasCode() {
        this.forgotPassword_dialog = false;
        this.alreadyHasCode = true;
    }

    openDialogForgotPassword() {
        this.forgotPassword_dialog = true;
    }

    login() {
        let data = {email: this.form["email"].value, password: this.form["password"].value};
        console.log(data);
        this.loginservicie.apiLogin(data.email, data.password).subscribe({
            next: response => {
                this.showMessages(response.status, response.information, "tst");
                if (response.status === 2) {
                    let dataLogin = response.data[0];
                    console.log(dataLogin.user_token);
                    this.loginservicie.setToken(dataLogin.user_token);
                    this.router.navigateByUrl('/app');
                }
            }
        })
        /* this.sessionLog = new Session("", new User("", "", "", "", "", ""));
         this.storageService.setCurrentSession(this.sessionLog);

         this.apiLogin().subscribe(response => {
           console.log(response);
           this.sessionLog = new Session("", new User("", "", "", "", "", ""));
           console.log("ANTES DE INGRESAR: ", this.sessionLog);
           this.storageService.setCurrentSession(this.sessionLog);
           this.showMessages(response.status, response.information, "tst");
           if (response.status === 2) {
             let dataLogin = response.data[0];
             this.user = new User(dataLogin.email_person, dataLogin.type_person, dataLogin.name_person,
               dataLogin.lastname_person, dataLogin.pathimg_person, dataLogin.provider_person);
             this.sessionLog = new Session(dataLogin.user_token, this.user);
             this.storageService.setCurrentSession(this.sessionLog);
             console.log(this.sessionLog);
             this.router.navigateByUrl('/app');
             //location.reload();
           }
         });*/
    }

    cancelRequestCode() {
        this.user.email = "";
        this.forgotPassword_dialog = false;
    }

    requestCode() {

        if (this.user.email === "") {
            this.utils.showMessages(3, "Ingrese un correo electrónico por favor.", "tst");
            return;
        }

        this.utils.loading;
        this.apiRequestCode().subscribe(response => {
            console.log(response);
            this.user.email = "";
            this.utils.closeLoading;
            this.forgotPassword_dialog = false;
            this.showMessages(response.status, response.information, "tst");
        });
    }

    cancelRecoverAccount() {
        this.user_rec = "";
        this.code_rec = "";
        this.password_rec = "";
        this.password_conf_rec = "";
        this.alreadyHasCode = false;
    }

    esContraseniaValida(): boolean {
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
        return pattern.test(this.password_rec);
    }

    recoverAccount() {

        if (this.user_rec === "") {
            this.utils.showMessages(3, "Ingrese un correo electrónico por favor.", "tst");
            return;
        }

        if (this.code_rec === "") {
            this.utils.showMessages(3, "Ingrese el código de verificación enviado al correo electrónico.", "tst");
            return;
        }

        if (this.password_rec === "") {
            this.utils.showMessages(3, "Ingrese una contraseña por favor.", "tst");
            return;
        }

        if (!this.esContraseniaValida()) {
            this.utils.showMessages(3, "La contraseña no cumple con los requisitos minimos requeridos.", "tst");
            return;
        }

        if (this.password_conf_rec === "") {
            this.utils.showMessages(3, "Debe volver a ingresar su nueva contraseña.", "tst");
            return;
        }

        if (this.password_rec !== this.password_conf_rec) {
            this.utils.showMessages(3, "Las contraseñas no son iguales.", "tst");
            return;
        }

        this.utils.loading;
        this.apiRecoverAccount().subscribe(response => {
            console.log(response);
            this.user_rec = "";
            this.code_rec = "";
            this.password_rec = "";
            this.password_conf_rec = "";
            this.utils.closeLoading;
            this.alreadyHasCode = false;
            this.showMessages(response.status, response.information, "tst");
        });

    }

    apiRecoverAccount(): Observable<any> {
        this.globalUri = this.utils.globalUrl + "persons/recoverAccount";
        return this._http.post<Person>(this.globalUri, {
            "email": this.user_rec,
            "password": this.password_conf_rec,
            "code": this.code_rec
        });
    }

    apiRequestCode(): Observable<any> {
        this.globalUri = this.utils.globalUrl + "persons/requestcode";
        return this._http.post<Person>(this.globalUri, {
            "flag": "2",
            "email": this.user.email,
            "code": ""
        });
    }

    showMessages(status: number, info: string, key: string) {
        this.service.add({
            key: key,
            severity: status === 1 ? "warn" : status === 2 ? "success" : status === 3 ? "error" : "info",
            summary: 'Virtus',
            detail: info
        });
    }

    loginWithFacebook(): void {
        console.log("iniciame con facebook");
        this.iniciarSesion(new auth.FacebookAuthProvider());
    }

    loginWithGoogle(): void {
        console.log("iniciame con google");
        this.iniciarSesion(new auth.GoogleAuthProvider());
    }

    iniciarSesion(provider: any): void {
        this.fAuth.signInWithPopup(provider).then((result: UserCredential) => {
            let userinfo = result.additionalUserInfo;
            let userprofile = userinfo!.profile;

            let datosUser = {
                isNewUser: userinfo!.isNewUser,
                provider: userinfo!.providerId,
                // @ts-ignore
                userid: String(userinfo!.profile!.id),
                userimage: "",
                useremail: "",
                username: "",
                userlastname: "",
            };
            console.log(userinfo);

            switch (userinfo!.providerId) {
                case "google.com": {
                    this.utils.showMessages(3, 'Debe permitir abrir ventanas emergentes', "tst");

                    // @ts-ignore
                    datosUser['userimage'] = userprofile!.picture;
                    // @ts-ignore
                    datosUser['useremail'] = userprofile!.email;
                    // @ts-ignore
                    datosUser['username'] = userprofile!.given_name;
                    // @ts-ignore
                    datosUser['userlastname'] = userprofile!.family_name;
                }
                    break;
                case "facebook.com": {
                    // @ts-ignore
                    datosUser['userimage'] = ("https://graph.facebook.com/" + userprofile.id + "/picture?type=large&amp;width=1080");
                    // @ts-ignore
                    datosUser['useremail'] = userprofile.email;
                    // @ts-ignore
                    datosUser['username'] = userprofile.first_name;
                    // @ts-ignore
                    datosUser['userlastname'] = userprofile.last_name;
                }
                    break;
                default:
                    break;
            }
            if (datosUser['userlastname'] === undefined) {
                // @ts-ignore
                let {username, ...datos} = datosUser;
                // @ts-ignore
                username = this.operarnombre(username) as JSON;//dividir el name de forma pro
                // @ts-ignore
                datosUser = {...datos, ...username};//juntar ambos json en uno solo :3
            }
            this.utils.loading;
            console.log("usuario logeado [linea 204]:", datosUser);
            this.apiRegisterGoogle(datosUser).subscribe({
                next: (response: any) => {
                    console.log(response);
                    if (response.status === 2) {
                        let dataLogin = response.data[0];
                        console.log(dataLogin.user_token);
                        this.loginservicie.setToken(dataLogin.user_token);
                        this.showMessages(2, "Inicio con Google.", "");

                        this.router.navigateByUrl('/app');
                    } else if (response.status === 2.2) {
                        this.showMessages(2, "Registro con Google.", "");
                        this.utils.closeLoading;
                        location.reload();

                    } else {
                        this.utils.showMessages(response.status, response.information, "tst");

                    }
                },
                error: (error: any) => {

                }
            })
        }).catch(function (error) {
            console.log("ERROR OAUTH", error)


        });
        this.utils.closeLoading;
        this.showMessages(4, "Service provider error!", "");
    }

    apiRegisterGoogle(data: any): Observable<any> {

        // if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        //   this.globalUri = "virtus_bk/";
        // } else {
        //   this.globalUri = "virtus_bk/";
        // }

        let headers = new HttpHeaders()
            .set('Access-Control-Allow-Origin', '*')
            .set('provider', data.provider);
        this.globalUri = this.utils.globalUrl + "persons/loginoauth";

        return this._http.post<any>(this.globalUri,
            {
                "useremail": data.useremail,
                "username": data.username,
                "userlastname": data.userlastname,
                "userid": data.userid,
                "userimage": data.userimage
            }, {headers: headers});
    }

    operarnombre(paramName: string): any {
        let partes = paramName.toString().trim().split(" ");
        let obj = {
            username: '',
            userlastname: ''
        };
        let limit: number = parseInt((partes.length / 2).toFixed(0), 10);
        for (let ind = 0; ind < partes.length; ind++) {
            let minpart = partes[ind];
            if (minpart.length > 0) {
                if (ind < limit) {
                    obj['username'] = obj['username'].length > 0 ? " " : "" + minpart;
                } else {
                    obj['userlastname'] = obj['userlastname'].length > 0 ? " " : "" + minpart;
                }
            }
        }
        return obj;
    }

}
