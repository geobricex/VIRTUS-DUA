import {Topic} from "./Topic";

export class Resources {
  private id: number;
  private nameResource: string;
  private descriptionResource: string;
  private pathfileResource: string;
  private pathvideoResource: string;
  private pathurlsignResource: string;
  private pathurlremoteResource: string;
  private dateregResource: string;
  private dateupdateResource: string;
  private stateResource: string;
  private topicsIdTopic: Topic;


  constructor(id: number, nameResource: string, descriptionResource: string, epathfileResource: string,
              pathvideoResource: string, pathurlsignResource: string, pathurlremoteResource: string,
              dateregResource: string, dateupdateResource: string, stateResource: string) {
    this.id = id;
    this.nameResource = nameResource;
    this.descriptionResource = descriptionResource;
    this.pathfileResource = epathfileResource;
    this.pathvideoResource = pathvideoResource;
    this.pathurlsignResource = pathurlsignResource;
    this.pathurlremoteResource = pathurlremoteResource;
    this.dateregResource = dateregResource;
    this.dateupdateResource = dateupdateResource;
    this.stateResource = stateResource;
  }

  get _id(): number {
    return this.id;
  }

  set _id(value: number) {
    this.id = value;
  }

  get _nameResource(): string {
    return this.nameResource;
  }

  set _nameResource(value: string) {
    this.nameResource = value;
  }

  get _pathfileResource(): string {
    return this.pathfileResource;
  }

  set _pathfileResource(value: string) {
    this.pathfileResource = value;
  }

  get _pathvideoResource(): string {
    return this.pathvideoResource;
  }

  set _pathvideoResource(value: string) {
    this.pathvideoResource = value;
  }

  get _pathurlsignResource(): string {
    return this.pathurlsignResource;
  }

  set _pathurlsignResource(value: string) {
    this.pathurlsignResource = value;
  }

  get _dateregResource(): string {
    return this.dateregResource;
  }

  set _dateregResource(value: string) {
    this.dateregResource = value;
  }

  get _dateupdateResource(): string {
    return this.dateupdateResource;
  }

  set _dateupdateResource(value: string) {
    this.dateupdateResource = value;
  }

  get _stateResource(): string {
    return this.stateResource;
  }

  set _stateResource(value: string) {
    this.stateResource = value;
  }

  get _topicsIdTopic(): Topic {
    return this.topicsIdTopic;
  }

  set _topicsIdTopic(value: Topic) {
    this.topicsIdTopic = value;
  }


  get _pathurlremoteResource(): string {
    return this.pathurlremoteResource;
  }

  set _pathurlremoteResource(value: string) {
    this.pathurlremoteResource = value;
  }


  get _descriptionResource(): string {
    return this.descriptionResource;
  }

  set _descriptionResource(value: string) {
    this.descriptionResource = value;
  }
}

