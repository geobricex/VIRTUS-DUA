import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "./util/Utils";

@Component({
  selector: 'app-config',
  template: `
    <p-confirmDialog [style]="{width: '50vw'}" key="positionDialog" position="bottom" [baseZIndex]="10000"
                     rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
    <a style="cursor: pointer" id="layout-config-button" class="layout-config-button"
       (click)="onConfigButtonClick($event)">
      <i class="pi pi-cog"></i>
    </a>
    <div class="layout-config" [ngClass]="{'layout-config-active': appMain.configActive}"
         (click)="appMain.onConfigClick($event)">

      <!--      <h5>Estilos de imagen</h5>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="none" [(ngModel)]="app.modeStyle"></p-radioButton>-->
      <!--        <label for="@prevent">Ninguno</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="grayscale(100%)" [(ngModel)]="app.modeStyle"></p-radioButton>-->
      <!--        <label for="@prevent">Blanco y Negro</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="sepia(100%)" [(ngModel)]="app.modeStyle"></p-radioButton>-->
      <!--        <label for="@prevent">Sepia</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="brightness(50%)" [(ngModel)]="app.modeStyle"></p-radioButton>-->
      <!--        <label for="@prevent">Brillo Bajo</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="contrast(200%)" [(ngModel)]="app.modeStyle"></p-radioButton>-->
      <!--        <label for="@prevent">Contraste Alto</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="saturate(250%)" [(ngModel)]="app.modeStyle"></p-radioButton>-->
      <!--        <label for="@prevent">Saturación Alta</label>-->
      <!--      </div>-->
      <!--      <h5>Tipo de Menú</h5>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="static" [(ngModel)]="app.menuMode" inputId="mode1"></p-radioButton>-->
      <!--        <label for="mode1">Estático</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="overlay" [(ngModel)]="app.menuMode" inputId="mode2"></p-radioButton>-->
      <!--        <label for="mode2">Oculto</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="slim" [(ngModel)]="app.menuMode" inputId="mode3"></p-radioButton>-->
      <!--        <label for="mode3">Delgado</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="menuMode" value="horizontal" [(ngModel)]="app.menuMode" inputId="mode4"></p-radioButton>-->
      <!--        <label for="mode4">Horizontal</label>-->
      <!--      </div>-->

      <!--      <h5>Input Style</h5>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="inputStyle" value="outlined" [(ngModel)]="app.inputStyle"-->
      <!--                       inputId="inputStyle1"></p-radioButton>-->
      <!--        <label for="inputStyle1">Outlined</label>-->
      <!--      </div>-->
      <!--      <div class="field-radiobutton">-->
      <!--        <p-radioButton name="inputStyle" value="filled" [(ngModel)]="app.inputStyle"-->
      <!--                       inputId="inputStyle2"></p-radioButton>-->
      <!--        <label for="inputStyle2">Filled</label>-->
      <!--      </div>-->

      <!--      <h5>Ripple Effect</h5>-->
      <!--      <p-inputSwitch [ngModel]="app.ripple" (onChange)="appMain.onRippleChange($event)"></p-inputSwitch>-->

      <!--      <h5>Temas de Imagen</h5>-->
      <!--      <div class="layout-themes">-->
      <!--        <div *ngFor="let i of imageThemes">-->
      <!--          <a style="cursor: pointer" (click)="changeTheme(i.name)">-->
      <!--            <img src="assets/layout/images/configurator/{{i.image}}" alt="{{i.name}}"/>-->
      <!--            <i class="pi pi-check" *ngIf="app.theme === i.name"></i>-->
      <!--          </a>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <h5>Temas de Degradado</h5>-->
      <!--      <div class="layout-themes">-->
      <!--        <div *ngFor="let g of gradientThemes">-->
      <!--          <a style="cursor: pointer" (click)="changeTheme(g.name)"-->
      <!--             [ngStyle]="{'background-image': 'linear-gradient(to right, ' + g.color1 +','+ g.color2+')'} ">-->
      <!--            <i class="pi pi-check" *ngIf="app.theme === g.name"></i>-->
      <!--          </a>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <h5>Temas Planos</h5>-->
      <!--      <div class="layout-themes">-->
      <!--        <div *ngFor="let f of flatThemes">-->
      <!--          <a style="cursor: pointer" (click)="changeTheme(f.name)" [ngStyle]="{'background-color': f.color}">-->
      <!--            <i class="pi pi-check" *ngIf="app.theme === f.name"></i>-->
      <!--          </a>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <h5>Extensiones de Accesibilidad</h5>-->
      <!--      <div class="p-panel" >-->

      <!--      </div>-->

      <p-accordion>
        <p-accordionTab header="Recursos en evaluaciones">
          <div class="col-12 ">
              <div class="field-checkbox">
                <p-inputSwitch class="p-inputswitch" [(ngModel)]="app.voiceCommand" ></p-inputSwitch>
                <label for="@prevent">Comandos de voz</label>
              </div>
              <div class="field-checkbox">
                <p-inputSwitch class="p-inputswitch" [(ngModel)]="app.auditoryResource" ></p-inputSwitch>
                <label for="@prevent">Recurso auditivo</label>
              </div>
              <div class="field-checkbox">
                <p-inputSwitch class="p-inputswitch" [(ngModel)]="app.visualResource" ></p-inputSwitch>
                <label for="@prevent">Recurso visual</label>
            </div>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Control de zoom">
          <div class="col-12 text-center">
            <div class="p-buttonset">
              <button pButton pRipple icon="pi pi-minus"
                      class="p-button-rounded p-button-warning mr-2 mb-2"
                      (click)="app.controlZoom(-1)"></button>
              <button pButton pRipple icon="pi pi-window-maximize"
                      class="p-button-rounded p-button-info mr-2 mb-2"
                      (click)="app.controlZoom(0)"></button>
              <button pButton pRipple icon="pi pi-plus"
                      class="p-button-rounded p-button-success mr-2 mb-2"
                      (click)="app.controlZoom(1)"></button>
            </div>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Estilos de Texto">
          <div class="field-radiobutton" *ngFor="let style of fontStyle">
            <p-radioButton name="menuMode" [value]="style.value" [(ngModel)]="app.testFontFamily"
                           (ngModelChange)="listenConfigChange()"></p-radioButton>
            <label for="@prevent">{{style.label}}</label>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Color de Texto">
          <div class="field-checkbox">
            <p-inputSwitch class="p-inputswitch" (click)="app.switchTextColor()"
                           [(ngModel)]="app.textColorChecked"></p-inputSwitch>
            <label for="@prevent">Activar Control</label>
          </div>
          <div class="field-checkbox">
            <p-colorPicker class="p-button-sm" (onChange)="app.textColorChange($event)"
                           [disabled]="!app.textColorChecked"></p-colorPicker>
            <label for="@prevent">Seleccione Color</label>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Estilos de imagen">
          <div class="field-radiobutton">
            <p-radioButton name="menuMode" value="none" [(ngModel)]="app.modeStyle"></p-radioButton>
            <label for="@prevent">Ninguno</label>
          </div>
          <div class="field-radiobutton">
            <p-radioButton name="menuMode" value="grayscale(100%)" [(ngModel)]="app.modeStyle"></p-radioButton>
            <label for="@prevent">Blanco y Negro</label>
          </div>
          <div class="field-radiobutton">
            <p-radioButton name="menuMode" value="sepia(100%)" [(ngModel)]="app.modeStyle"></p-radioButton>
            <label for="@prevent">Sepia</label>
          </div>
          <div class="field-radiobutton">
            <p-radioButton name="menuMode" value="brightness(50%)" [(ngModel)]="app.modeStyle"></p-radioButton>
            <label for="@prevent">Brillo Bajo</label>
          </div>
          <div class="field-radiobutton">
            <p-radioButton name="menuMode" value="contrast(200%)" [(ngModel)]="app.modeStyle"></p-radioButton>
            <label for="@prevent">Contraste Alto</label>
          </div>
          <div class="field-radiobutton">
            <p-radioButton name="menuMode" value="saturate(250%)" [(ngModel)]="app.modeStyle"></p-radioButton>
            <label for="@prevent">Saturación Alta</label>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Temas de Imagen">
          <div class="layout-themes">
            <div *ngFor="let i of imageThemes">
              <a style="cursor: pointer" (click)="changeTheme(i.name)">
                <img src="assets/layout/images/configurator/{{i.image}}" alt="{{i.name}}"/>
                <i class="pi pi-check" *ngIf="app.theme === i.name"></i>
              </a>
            </div>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Temas de Degradado">
          <div class="layout-themes">
            <div *ngFor="let g of gradientThemes">
              <a style="cursor: pointer" (click)="changeTheme(g.name)"
                 [ngStyle]="{'background-image': 'linear-gradient(to right, ' + g.color1 +','+ g.color2+')'} ">
                <i class="pi pi-check" *ngIf="app.theme === g.name"></i>
              </a>
            </div>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Temas Planos">
          <div class="layout-themes">
            <div *ngFor="let f of flatThemes">
              <a style="cursor: pointer" (click)="changeTheme(f.name)" [ngStyle]="{'background-color': f.color}">
                <i class="pi pi-check" *ngIf="app.theme === f.name"></i>
              </a>
            </div>
          </div>
        </p-accordionTab>
        <p-accordionTab header="Extensiones de Accesibilidad">
          <div class="p-fieldset">
            <a pButton class="p-button p-button-danger col-12" label="Read Aloud:Texto a Voz" target="_blank"
               [href]="'https://chrome.google.com/webstore/detail/read-aloud-a-text-to-spee/hdhinadidafjejdhmfkjgnolgimiaplp'"></a>
          </div>
          <div class="p-fieldset">
            <a pButton class="p-button p-button-secondary col-12" label="Speakit!: Texto a Voz" target="_blank"
               [href]="'https://chrome.google.com/webstore/detail/speakit-text-to-speech-fo/aljmkoflmjkklddjideacgmofobfkhkd?hl=es'"></a>
          </div>
          <div class="p-fieldset">
            <a pButton class="p-button p-button-success col-12" label="Traductor de Google" target="_blank"
               [href]="'https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb?hl=es'"></a>
          </div>
          <div class="p-fieldset">
            <a pButton class="p-button p-button-info col-12" label="Cambiador de Fuente" target="_blank"
               [href]="'https://chrome.google.com/webstore/detail/font-changer/obgkjikcnonokgaiablbenkgjcdbknna'"></a>
          </div>
          <div class="p-fieldset">
            <a pButton class="p-button p-button-warning col-12" label="Potenciador de Color" target="_blank"
               [href]="'https://chrome.google.com/webstore/detail/color-enhancer/ipkjmjaledkapilfdigkgfmpekpfnkih?hl=es'"></a>
          </div>
          <div class="p-fieldset">
            <a pButton class="p-button p-button-help col-12" label="Modo Oscuro" target="_blank"
               [href]="'https://chrome.google.com/webstore/detail/dark-mode/dmghijelimhndkbmpgbldicpogfkceaj?hl=es-419'"></a>
          </div>
        </p-accordionTab>
      </p-accordion>
      <div class="p-fieldset col-12 text-center">
        <button id="reproducir_video_rec" pButton pRipple icon="pi pi-save"
                class="p-button p-button-secundary" label="Guardar Preferencias"
                (click)="app.guardarConfiguracion()"></button>
      </div>
    </div>
  `
})
export class AppConfigComponent implements OnInit {

  flatThemes: any[];

  imageThemes: any[];

  gradientThemes: any[];

  fontStyle: any[];

  constructor(public appMain: AppMainComponent, public app: AppComponent) {
  }

  ngOnInit() {
    this.flatThemes = [
      {name: 'absolution', color: '#628292'},
      {name: 'rebirth', color: '#007ad9'},
      {name: 'hope', color: '#67487e'},
      {name: 'bliss', color: '#00b395'},
      {name: 'grace', color: '#5d2f92'},
      {name: 'dusk', color: '#dd8400'},
      {name: 'navy', color: '#005a9e'},
      {name: 'infinity', color: '#617e76'},
      {name: 'fate', color: '#0d5fa6'},
      {name: 'ruby', color: '#ca5861'},
      {name: 'comfort', color: '#0084a1'},
    ];

    this.gradientThemes = [
      {name: 'faith', color1: '#622774', color2: '#c53364'},
      {name: 'violet', color1: '#5b247a', color2: '#1bcedf'},
      {name: 'honor', color1: '#3bb2b8', color2: '#00dac7'},
      {name: 'rebel', color1: '#7367f0', color2: '#ce9ffc'},
      {name: 'vanity', color1: '#f76b1c', color2: '#fad961'},
      {name: 'valor', color1: '#ff6b52', color2: '#ff9851'},
      {name: 'merit', color1: '#1c4652', color2: '#3d7b8a'},
      {name: 'esprit', color1: '#276174', color2: '#33c58e'},
      {name: 'concord', color1: '#5e2563', color2: '#65799b'},
      {name: 'dulce', color1: '#b3305f', color2: '#ffaa85'},
      {name: 'royal', color1: '#171717', color2: '#020202'},
    ];

    this.imageThemes = [
      {name: 'hazel', image: 'hazel.jpg'},
      {name: 'essence', image: 'essence.jpg'},
      {name: 'eternity', image: 'eternity.jpg'},
      {name: 'clarity', image: 'clarity.jpg'},
      {name: 'solace', image: 'solace.jpg'},
      {name: 'joy', image: 'joy.jpg'},
      {name: 'purity', image: 'purity.jpg'},
      {name: 'euclid', image: 'euclid.jpg'},
      {name: 'elegance', image: 'elegance.jpg'},
      {name: 'tranquil', image: 'tranquil.jpg'}
    ];

    this.fontStyle = [
      {"label": "Default", "value": "'Exo 2', sans-serif"},
      {"label": "Times New Roman", "value": "'Times New Roman', Georgia, Serif"},
      {"label": "Arial (sans-serif)", "value": "'Arial', sans-serif"},
      {"label": "Arial Black (sans-serif)", "value": "'Arial Black', sans-serif"},
      {"label": "Verdana (sans-serif)", "value": "'Verdana', sans-serif"},
      {"label": "Tahoma (sans-serif)", "value": "'Tahoma', sans-serif"},
      {"label": "Impact (sans-serif)", "value": "'Impact', sans-serif"},
      {"label": "Times New Roman (serif)", "value": "'Times New Roman', serif"},
      {"label": "Didot (serif)", "value": "'Didot', serif"},
      {"label": "Georgia (serif)", "value": "'Georgia', serif"},
      {"label": "American Typewriter (serif)", "value": "'American Typewriter', serif"},
      {"label": "Andale Mono (monospace)", "value": "'Andale Mono', monospace"},
      {"label": "Courier (monospace)", "value": "'Courier', monospace"},
      {"label": "Lucida Console (monospace)", "value": "'Lucida', monospace"},
      {"label": "Monaco (monospace)", "value": "'Monaco', monospace"},
      {"label": "Bradley Hand (cursiva)", "value": "'Bradley Hand', cursiva"},
      {"label": "Brush Script MT (cursiva)", "value": "'Brush Script MT', cursiva"},
      {"label": "Luminari (fantasy)", "value": "'Luminari', fantasy"},
      {"label": "Comic Sans MS (cursiva)", "value": "'Comic Sans MS', cursiva"},
      // {"label":"Helvetica", "value":""},
      // {"label":"Cambria", "value":""}

    ];
  }


  changeTheme(theme: any) {
    this.app.changeTheme(theme);
  }

  listenConfigChange(): void {
    console.log("text estilo:", this.app.testFontFamily);
  }

  onConfigButtonClick(event: any) {
    this.appMain.configActive = !this.appMain.configActive;
    this.appMain.configClick = true;
    event.preventDefault();
  }

}
