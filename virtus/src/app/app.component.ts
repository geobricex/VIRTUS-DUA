import {Component, HostBinding, Input} from '@angular/core';
import {ConfirmationService, PrimeNGConfig} from 'primeng/api';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "./util/Utils";
import {AppConfigComponent} from "./app.config.component";
import {Resources} from "./models/Resources";
import {Topic} from "./models/Topic";
import {InterfaceSettings} from "./models/globalInterfaces";
import {LoginServicie} from "./pages/loginServicie";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  menuMode = 'static';

  theme = 'absolution';

  inputStyle = 'filled';//outlined

  ripple: boolean;

  @HostBinding("style.--image-video-style")
  @Input()
  public modeStyle: string = 'none';

  @HostBinding("style.--text-color-style")
  @Input()
  public textColor: string = 'none';
  //auxiliar
  public textColorChecked: boolean = false;

  @HostBinding("style.--text-font-family")
  @Input()
  public testFontFamily: string = "'Exo 2', sans-serif";

  @HostBinding("style.--document-zoom-style")
  @Input()
  public documentZoom: string = '100%';
  //auxiliar
  public valorDocumentZoom: number = 100;

  public voiceCommand: boolean = true;
  public auditoryResource: boolean = true;
  public visualResource: boolean = true;


  constructor(private primengConfig: PrimeNGConfig,
              private _http: HttpClient,
              private utils: Utils,
              public confirmationService: ConfirmationService,
              private loginservicie: LoginServicie) {

  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.ripple = true;
  }


  ngAfterViewInit(): void {
    this.cargarConfiguracion();
  }

  /*evento de Botón para establecer colores a todos los textos*/
  switchTextColor(): void {
    if (!this.textColorChecked) {
      this.textColor = "none";
    }
    console.log("checked: ", this.textColorChecked, this.textColor)
  }

  /*evento para cambiar colores*/
  textColorChange(e: any): void {
    if (this.textColorChecked) {
      this.textColor = e.value;
    }
    console.log("color: ", this.textColor);
  }

  controlZoom(valor: number): void {
    if (valor == 0) {
      this.valorDocumentZoom = 100;
    } else {
      this.valorDocumentZoom = (this.valorDocumentZoom + valor);
      //minimo de zoom
      if (this.valorDocumentZoom < 90) {
        this.valorDocumentZoom = 0;
      }
      //maximo de zoom
      if (this.valorDocumentZoom > 105) {
        this.valorDocumentZoom = 105;
      }
    }
    this.documentZoom = (this.valorDocumentZoom + '%');
    console.log("nuevo zoom", this.documentZoom);


  };

  listenConfigChange(): void {
    console.log("Se ha modificado la configuracion de la app");
  }

  reiniciarConfiguracion (): void {
    let configSaved: InterfaceSettings  = {};
    console.log("response cargarConfiguración: ", configSaved);
    if (configSaved.modeStyle !== undefined) {
      this.modeStyle = configSaved.modeStyle;
    }
    if (configSaved.textColorChecked !== undefined) {
      this.textColorChecked = configSaved.textColorChecked;
    }
    if (configSaved.textColor !== undefined) {
      this.textColor = configSaved.textColor;
    }
    if (configSaved.valorDocumentZoom !== undefined) {
      this.valorDocumentZoom = configSaved.valorDocumentZoom;
    }
    if (configSaved.testFontFamily !== undefined) {
      this.testFontFamily = configSaved.testFontFamily.replace(/''/g, "'");
    }

    if (configSaved.voiceCommand !== undefined) {
      this.voiceCommand = configSaved.voiceCommand;
    }
    if (configSaved.auditoryResource !== undefined) {
      this.auditoryResource = configSaved.auditoryResource;
    }
    if (configSaved.visualResource !== undefined) {
      this.visualResource = configSaved.visualResource;
    }
    configSaved.theme = "absolution";
    this.changeTheme(configSaved.theme);
  }

  cargarConfiguracion(): void {
    let urlServicio = this.utils.globalUrl + "settings/getserviceforperson";
    let headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('provider', 'native')
      .set('token', this.loginservicie.getToken());
    this._http.post<any>(urlServicio, null, {headers: headers}).subscribe(response => {
      if (response.status == 2) {
        console.log("1", (response.data));
        console.log("2", (response.data[0]));
        console.log("3", response.data[0].settingConfiguration);

        let configSaved: InterfaceSettings = JSON.parse(response.data[0].settingConfiguration);
        console.log("response cargarConfiguración: ", configSaved);
        if (configSaved.modeStyle !== undefined) {
          this.modeStyle = configSaved.modeStyle;
        }
        if (configSaved.textColorChecked !== undefined) {
          this.textColorChecked = configSaved.textColorChecked;
        }
        if (configSaved.textColor !== undefined) {
          this.textColor = configSaved.textColor;
        }
        if (configSaved.valorDocumentZoom !== undefined) {
          this.valorDocumentZoom = configSaved.valorDocumentZoom;
        }
        if (configSaved.testFontFamily !== undefined) {
          this.testFontFamily = configSaved.testFontFamily.replace(/''/g, "'");
        }

        if (configSaved.voiceCommand !== undefined) {
          this.voiceCommand = configSaved.voiceCommand;
        }
        if (configSaved.auditoryResource !== undefined) {
          this.auditoryResource = configSaved.auditoryResource;
        }
        if (configSaved.visualResource !== undefined) {
          this.visualResource = configSaved.visualResource;
        }
        this.changeTheme(configSaved.theme);
        //AppConfigComponent.changeTheme(configSaved.theme);
      } else {
        this.reiniciarConfiguracion();
      }

    })
  }


  guardarConfiguracion(): void {
    this.confirmationService.confirm({
      message: '¿Seguro que desea guardar esta configuración?',
      header: 'Mensaje de confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => {
        let actualPreferences = JSON.stringify(
          {
            "theme": this.theme,
            "modeStyle": this.modeStyle,
            "textColorChecked": this.textColorChecked,
            "testFontFamily": this.testFontFamily,
            "textColor": this.textColor,
            "documentZoom": this.documentZoom,
            "valorDocumentZoom": this.valorDocumentZoom,
            "voiceCommand": this.voiceCommand,
            "auditoryResource": this.auditoryResource,
            "visualResource": this.visualResource
          }
        );
        console.log('guardarConfiguracion', actualPreferences);

        // "datereg_setting ": "",
        // "id_setting ": "",
        // "dateupdate_setting": "",
        // "persons_id_person": -1

        let urlServicio = this.utils.globalUrl + "settings/insertservice";
        let headers = new HttpHeaders()
          .set('Access-Control-Allow-Origin', '*')
          .set('provider', 'native')
          .set('token', this.loginservicie.getToken());
        this._http.post<any>(urlServicio, {
          "setting_configuration": actualPreferences
        }, {headers: headers}).subscribe(response => {
          console.log("guardarConfiguracion: ", response);

          this.utils.showMessages(response.status, response.information, "tst");
        });
      },
      reject: () => {

      },
      key: "positionDialog"
    });

  }

  changeTheme(theme: any) {
    this.theme = theme;

    const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
    const layoutHref = 'assets/layout/css/layout-' + theme + '.css';

    this.replaceLink(layoutLink, layoutHref);

    const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
    const themeHref = 'assets/theme/theme-' + theme + '.css';

    this.replaceLink(themeLink, themeHref);

  }


  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

  replaceLink(linkElement: any, href: any) {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);
      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');
      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }


}
