import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../app.breadcrumb.service";

@Component({
  selector: 'app-information-ar',
  templateUrl: './information-ar.component.html',
  styleUrls: ['./information-ar.component.scss']
})
export class InformationArComponent implements OnInit, AfterViewInit {
  comandosTeclado: any [];
  comandosVoz: any [];

  constructor(
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app']},
      {label: 'Mas información', routerLink: ['/app/admins/informationar']}
    ]);
  }

  ngAfterViewInit() {
    console.clear();
  }

  ngOnInit(): void {
    this.comandosTeclado = [
      {comando_base: "Shift.png", comando_sec: "right.png", descripcion: "Siguiente pregunta"},
      {comando_base: "Shift.png", comando_sec: "left.png", descripcion: "Anterior pregunta"},
      {comando_base: "Shift.png", comando_sec: "enter.png", descripcion: "Enviar formulario"},
      {comando_base: "Shift.png", comando_sec: "esc.png", descripcion: "Ver y ocultar video de señas"},
      {comando_base: "Shift.png", comando_sec: "backspace.png", descripcion: "Repetir el audio de la pregunta"},
      {comando_base: "Shift.png", comando_sec: "tab.png", descripcion: "Ver bancos de preguntas bancos"},
      {comando_base: "Shift.png", comando_sec: "a.png", descripcion: "Literal a"},
      {comando_base: "Shift.png", comando_sec: "b.png", descripcion: "Literal b"},
      {comando_base: "Shift.png", comando_sec: "c.png", descripcion: "Literal c"},
      {comando_base: "Shift.png", comando_sec: "d.png", descripcion: "Literal d"},
      {comando_base: "Shift.png", comando_sec: "e.png", descripcion: "Literal e"},
      {comando_base: "Shift.png", comando_sec: "f.png", descripcion: "Literal f"},
    ];
    this.comandosVoz = [
      {comando: "Video pausa", descripcion: "Colocar el video en pausa"},
      {comando: "Video reproducir", descripcion: "Colocar el video en reproducción"},
      {comando: "Comando siguiente", descripcion: "Colocar el video en reproducción"},
      {comando: "Comando anterior", descripcion: "Colocar el video en reproducción"},
      {comando: "Comando enviar", descripcion: "Colocar el video en reproducción"},
      {comando: "Literal a", descripcion: "Seleccionar literal a"},
      {comando: "Literal b", descripcion: "Seleccionar literal b"},
      {comando: "Literal c", descripcion: "Seleccionar literal c"},
      {comando: "Literal d", descripcion: "Seleccionar literal d"},
      {comando: "Literal e", descripcion: "Seleccionar literal e"},
      {comando: "Literal f", descripcion: "Seleccionar literal f"}
    ];

  }

}
