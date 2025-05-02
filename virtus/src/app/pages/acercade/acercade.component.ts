import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Development} from "../../models/acercaDe";
import {BreadcrumbService} from "../../app.breadcrumb.service";

@Component({
  selector: 'app-acercade',
  templateUrl: './acercade.component.html',
  styleUrls: ['./acercade.component.scss']
})
export class AcercadeComponent implements OnInit, AfterViewInit {

  developments = [] as Development[];

  constructor(
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      {label: '', routerLink: ['/app']},
      {label: 'Acerca de', routerLink: ['/app/about']}
    ]);
  }
  ngAfterViewInit() {
    console.clear();
  }
  ngOnInit(): void {
    this.developments = [
      {name: "Geovanny José", lastname: "Brito Casanova", cargo: "Backend", facebook: "", github: "",image: "brito.png", email: "", instagram: "", linkedin: ""},
      {name: "Dúval Ricardo", lastname: "Carvajal Suárez", cargo: "Frontend", facebook: "", github: "",image: "duval.jpg", email: "", instagram: "", linkedin: ""},
      {name: "Anthony Abraham", lastname: "Pachay Espinoza", cargo: "Infraestructura", facebook: "", github: "",image: "pachay.jpg", email: "", instagram: "", linkedin: ""},
      {name: "Valeria Dayanna", lastname: "Torres Lindao", cargo: "Documentación", facebook: "", github: "",image: "valeria.jpeg", email: "", instagram: "", linkedin: ""}
    ];
  }

}
