export class Person {
  private id: number;
  private namePerson: string;
  private lastnamePerson: string;
  private emailPerson: string;
  private passwordPerson: string;
  private typePerson: string;
  private pathimgPerson: string;
  private codeverificationPerson: string;
  private dateregPerson: string;
  private dateupdatePerson: string;
  private providerPerson: string;
  private idLocation: string;


  constructor(id: number, namePerson: string, lastnamePerson: string, emailPerson: string, typePerson: string, pathimgPerson: string, codeverificationPerson: string, dateregPerson: string, dateupdatePerson: string, providerPerson: string, idLocation: string) {
    this.id = id;
    this.namePerson = namePerson;
    this.lastnamePerson = lastnamePerson;
    this.emailPerson = emailPerson;
    this.typePerson = typePerson;
    this.pathimgPerson = pathimgPerson;
    this.codeverificationPerson = codeverificationPerson;
    this.dateregPerson = dateregPerson;
    this.dateupdatePerson = dateupdatePerson;
    this.providerPerson = providerPerson;
    this.idLocation = idLocation;
  }

  get _id(): number {
    return this.id;
  }

  set _id(value: number) {
    this.id = value;
  }

  get _namePerson(): string {
    return this.namePerson;
  }

  set _namePerson(value: string) {
    this.namePerson = value;
  }

  get _lastnamePerson(): string {
    return this.lastnamePerson;
  }

  set _lastnamePerson(value: string) {
    this.lastnamePerson = value;
  }

  get _emailPerson(): string {
    return this.emailPerson;
  }

  set _emailPerson(value: string) {
    this.emailPerson = value;
  }

  get _passwordPerson(): string {
    return this.passwordPerson;
  }

  set _passwordPerson(value: string) {
    this.passwordPerson = value;
  }

  get _typePerson(): string {
    return this.typePerson;
  }

  set _typePerson(value: string) {
    this.typePerson = value;
  }

  get _pathimgPerson(): string {
    return this.pathimgPerson;
  }

  set _pathimgPerson(value: string) {
    this.pathimgPerson = value;
  }

  get _codeverificationPerson(): string {
    return this.codeverificationPerson;
  }

  set _codeverificationPerson(value: string) {
    this.codeverificationPerson = value;
  }

  get _dateregPerson(): string {
    return this.dateregPerson;
  }

  set _dateregPerson(value: string) {
    this.dateregPerson = value;
  }

  get _dateupdatePerson(): string {
    return this.dateupdatePerson;
  }

  set _dateupdatePerson(value: string) {
    this.dateupdatePerson = value;
  }

  get _providerPerson(): string {
    return this.providerPerson;
  }

  set _providerPerson(value: string) {
    this.providerPerson = value;
  }

  get _idLocation(): string {
    return this.idLocation;
  }

  set _idLocation(value: string) {
    this.idLocation = value;
  }
}


