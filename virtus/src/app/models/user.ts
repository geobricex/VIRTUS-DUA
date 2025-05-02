import {last} from "rxjs/operators";

export class User {
  private _email: string;
  private _password: string;
  private _type_person: string;
  private _name_person: string;
  private _last_name: string;
  private _pathimg_person: string;
  private _provider_person: string;
  
  constructor(email: string, type_person: string, name_person: string, last_name: string,
              pathimg_person: string, provider_person: string) {
    this._email = email;
    this._type_person = type_person
    this._name_person = name_person;
    this._last_name = last_name;
    this._pathimg_person = pathimg_person;
    this._provider_person = provider_person;
  }


  get name_person(): string {
    return this._name_person;
  }

  set name_person(value: string) {
    this._name_person = value;
  }

  get last_name(): string {
    return this._last_name;
  }

  set last_name(value: string) {
    this._last_name = value;
  }

  get pathimg_person(): string {
    return this._pathimg_person;
  }

  set pathimg_person(value: string) {
    this._pathimg_person = value;
  }

  get provider_person(): string {
    return this._provider_person;
  }

  set provider_person(value: string) {
    this._provider_person = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get type_person(): string {
    return this._type_person;
  }

  set type_person(value: string) {
    this._type_person = value;
  }
}

