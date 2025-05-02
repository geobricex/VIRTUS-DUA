import {Person} from "./Person";

export class Course {
  private id: number;
  private nameCourse: string;
  private descriptionCourse: string;
  private keywordsCourse: string;
  private pathimgCourse: string;
  private dateregCourse: string;
  private dateupdateCourse: string;
  private stateCourse: string;
  private languageCourse: string;
  private priceCourse: string;
  private personsIdPerson: Person;


  constructor(id: number, nameCourse: string, descriptionCourse: string, keywordsCourse: string, pathimgCourse: string, dateregCourse: string, dateupdateCourse: string, stateCourse: string, languageCourse: string, priceCourse: string) {
    this.id = id;
    this.nameCourse = nameCourse;
    this.descriptionCourse = descriptionCourse;
    this.keywordsCourse = keywordsCourse;
    this.pathimgCourse = pathimgCourse;
    this.dateregCourse = dateregCourse;
    this.dateupdateCourse = dateupdateCourse;
    this.stateCourse = stateCourse;
    this.languageCourse = languageCourse;
    this.priceCourse = priceCourse;
  }

  get _id(): number {
    return this.id;
  }

  set _id(value: number) {
    this.id = value;
  }

  get _nameCourse(): string {
    return this.nameCourse;
  }

  set _nameCourse(value: string) {
    this.nameCourse = value;
  }

  get _descriptionCourse(): string {
    return this.descriptionCourse;
  }

  set _descriptionCourse(value: string) {
    this.descriptionCourse = value;
  }

  get _keywordsCourse(): string {
    return this.keywordsCourse;
  }

  set _keywordsCourse(value: string) {
    this.keywordsCourse = value;
  }

  get _pathimgCourse(): string {
    return this.pathimgCourse;
  }

  set _pathimgCourse(value: string) {
    this.pathimgCourse = value;
  }

  get _dateregCourse(): string {
    return this.dateregCourse;
  }

  set _dateregCourse(value: string) {
    this.dateregCourse = value;
  }

  get _dateupdateCourse(): string {
    return this.dateupdateCourse;
  }

  set _dateupdateCourse(value: string) {
    this.dateupdateCourse = value;
  }

  get _stateCourse(): string {
    return this.stateCourse;
  }

  set _stateCourse(value: string) {
    this.stateCourse = value;
  }

  get _languageCourse(): string {
    return this.languageCourse;
  }

  set _languageCourse(value: string) {
    this.languageCourse = value;
  }

  get _priceCourse(): string {
    return this.priceCourse;
  }

  set _priceCourse(value: string) {
    this.priceCourse = value;
  }


  get _personsIdPerson(): Person {
    return this.personsIdPerson;
  }

  set _personsIdPerson(value: Person) {
    this.personsIdPerson = value;
  }
}
