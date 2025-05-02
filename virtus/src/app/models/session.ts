import {User} from "./user";

export class Session {
  private _token: string;
  private _user: User;


  constructor(token: string, user: User) {
    this._token = token;
    this._user = user;
  }


  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }
}
