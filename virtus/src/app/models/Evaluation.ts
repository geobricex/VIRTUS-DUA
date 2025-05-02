import {Topic} from "./Topic";

export class Evaluation {
  private id: number;
  private nameEvaluation: string;
  private descriptionEvaluation: string;
  private dateregEvaluation: string;
  private dateupdateEvaluation: string;
  private timeEvaluation: string;
  private timeminutesEvaluation: number;
  private numberquestionEvaluation: number;
  private state_evaluation: string;
  private typeEvaluation: string;
  private opportunityEvaluation: boolean;
  private opportunitiesEvaluation: number;
  private topicsIdTopic: Topic
  private orderCategory: boolean;
  private allowsReview: boolean;


  constructor(id: number, nameEvaluation: string, descriptionEvaluation: string, dateregEvaluation: string,
              dateupdateEvaluation: string, timeEvaluation: string, timeminutesEvaluation: number,
              numberquestionEvaluation: number, state_evaluation: string, typeEvaluation: string,
              opportunityEvaluation: boolean, opportunitiesEvaluation: number, orderCategory: boolean, allowsReview: boolean) {
    this.id = id;
    this.nameEvaluation = nameEvaluation;
    this.descriptionEvaluation = descriptionEvaluation;
    this.dateregEvaluation = dateregEvaluation;
    this.dateupdateEvaluation = dateupdateEvaluation;
    this.timeEvaluation = timeEvaluation;
    this.timeminutesEvaluation = timeminutesEvaluation;
    this.numberquestionEvaluation = numberquestionEvaluation;
    this.state_evaluation = state_evaluation;
    this.typeEvaluation = typeEvaluation;
    this.opportunityEvaluation = opportunityEvaluation;
    this.opportunitiesEvaluation = opportunitiesEvaluation;
    this.orderCategory = orderCategory;
    this.allowsReview = allowsReview;
  }

  get _id(): number {
    return this.id;
  }

  set _id(value: number) {
    this.id = value;
  }

  get _nameEvaluation(): string {
    return this.nameEvaluation;
  }

  set _nameEvaluation(value: string) {
    this.nameEvaluation = value;
  }

  get _descriptionEvaluation(): string {
    return this.descriptionEvaluation;
  }

  set _descriptionEvaluation(value: string) {
    this.descriptionEvaluation = value;
  }

  get _dateregEvaluation(): string {
    return this.dateregEvaluation;
  }

  set _dateregEvaluation(value: string) {
    this.dateregEvaluation = value;
  }

  get _dateupdateEvaluation(): string {
    return this.dateupdateEvaluation;
  }

  set _dateupdateEvaluation(value: string) {
    this.dateupdateEvaluation = value;
  }

  get _timeEvaluation(): string {
    return this.timeEvaluation;
  }

  set _timeEvaluation(value: string) {
    this.timeEvaluation = value;
  }

  get _timeminutesEvaluation(): number {
    return this.timeminutesEvaluation;
  }

  set _timeminutesEvaluation(value: number) {
    this.timeminutesEvaluation = value;
  }

  get _numberquestionEvaluation(): number {
    return this.numberquestionEvaluation;
  }

  set _numberquestionEvaluation(value: number) {
    this.numberquestionEvaluation = value;
  }

  get _state_evaluation(): string {
    return this.state_evaluation;
  }

  set _state_evaluation(value: string) {
    this.state_evaluation = value;
  }

  get _typeEvaluation(): string {
    return this.typeEvaluation;
  }

  set _typeEvaluation(value: string) {
    this.typeEvaluation = value;
  }

  get _topicsIdTopic(): Topic {
    return this.topicsIdTopic;
  }

  set _topicsIdTopic(value: Topic) {
    this.topicsIdTopic = value;
  }


  get _opportunityEvaluation(): boolean {
    return this.opportunityEvaluation;
  }

  set _opportunityEvaluation(value: boolean) {
    this.opportunityEvaluation = value;
  }

  get _opportunitiesEvaluation(): number {
    return this.opportunitiesEvaluation;
  }

  set _opportunitiesEvaluation(value: number) {
    this.opportunitiesEvaluation = value;
  }


  get _orderCategory(): boolean {
    return this.orderCategory;
  }

  set _orderCategory(value: boolean) {
    this.orderCategory = value;
  }

  get _allowsReview(): boolean {
    return this.allowsReview;
  }

  set _allowsReview(value: boolean) {
    this.allowsReview = value;
  }
}
