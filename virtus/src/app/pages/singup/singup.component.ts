import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Person} from "../../models/Person";

import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../../util/Utils";
import {Message} from "primeng/api";
import {FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, FormBuilder} from '@angular/forms';
import {error} from "protractor";

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit, AfterViewInit {

  person: Person;
  newpassword: string;
  globalUri: string = "";
  date: Date;
  msgs: Message[] = [];

  frmSingUp: FormGroup;

  constructor(
    private utils: Utils,
    private _http: HttpClient,
    private formBuilder: FormBuilder,
  ) {
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.person = new Person(0, "", "", "", "", "", "", "", "", "", "");
    this.date = new Date();
    this.frmSingUp = this.formBuilder.group({
      name: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", Validators.required, Validators.email],
      password: ["", Validators.required],
      repeat_password: ["", Validators.required]
    });
  }

  get form() {
    return this.frmSingUp.controls;
  }

  registerUser() {

    if (this.frmSingUp.invalid) {
      this.utils.showMessages(1, "EL formulario de registro es invalido.", "tst");
      return;
    }

    if (this.newpassword !== this.person._passwordPerson) {
      this.utils.showMessages(1, "Las contraseñas no son iguales, intente de nuevo.", "tst");
      return;
    }

    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Virtus', detail: 'Procesando...'});
    this.person._namePerson = this.form["name"].value;
    this.person._lastnamePerson = this.form["lastname"].value;
    this.person._emailPerson = this.form["email"].value;
    this.person._passwordPerson = this.form["password"].value;
    this.person._codeverificationPerson = "000";
    this.person._dateregPerson = "";//this.date.toISOString().split('T')[0] + " " + this.date.getHours() + ":" + this.date.getMinutes();
    this.person._dateupdatePerson = "";// this.date.toISOString().split('T')[0] + " " + this.date.getHours() + ":" + this.date.getMinutes();
    this.person._idLocation = "0-0-0";
    this.person._providerPerson = "native";
    this.person._typePerson = "S";
    console.log(this.person);
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Espere...', detail: 'Enviando verificación al correo...'});

    this.apirRegisterUser(this.person).subscribe(response => {
        this.frmSingUp.reset();
        console.log(response);
        if (response.status === 2) {
          this.msgs = [];
          this.msgs.push({severity: 'info', summary: 'Correcto', detail: 'Revise el correo proporcionado...'});
          this.utils.showMessages(response.status, response.information, "tst");
          this.person = new Person(0, "", "", "", "", "", "", "", "", "", "");
          this.newpassword = "";
        } else {
          this.utils.showMessages(response.status, response.information, "tst");
        }
      }
    );
  }

  apirRegisterUser(person: Person):
    Observable<any> {
    // if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    //   this.globalUri = "virtus_bk/persons/signup";
    // } else {
    //   // this.globalUri = "virtusbk/persons/signup";
    //   this.globalUri = "virtusbk/persons/signup";
    // }
    this.globalUri = this.utils.globalUrl + "persons/signup";

    return this._http.post<Person>(this.globalUri, person);
  }

}
