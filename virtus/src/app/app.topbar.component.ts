import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {User} from './models/user';
import {StorageService} from "./authentication/StorageService";
import {Router} from "@angular/router";
import {Utils} from "./util/Utils";
import {LoginServicie} from "./pages/loginServicie";
import {PersonInterface} from "./models/PersonInterface";
import {AppComponent} from "./app.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {InterfaceSettings} from "./models/globalInterfaces";

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

  menuMode = 'static';

  theme = 'absolution';

  inputStyle = 'filled';//outlined

  ripple: boolean;

  public person: PersonInterface;
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

  constructor(public app: AppMainComponent,
              private storageService: StorageService,
              public router: Router,
              public utils: Utils,
              private loginservicie: LoginServicie,
              private _http: HttpClient,) {
  }

  ngOnInit(): void {
    this.loginservicie.getDataPerson(this.loginservicie.getToken()).subscribe({
      next: response => {
        //console.log(response);
        this.person = response;
        console.log(" this.person")
        console.log(this.person)
        this.person.pathimgPerson = this.person.pathimgPerson === undefined ? "" : this.person.pathimgPerson;
        this.storageService.setCurrentSession(this.person);
        if (this.person === null) {
          this.router.navigateByUrl('/login');
          return;
        }
      }, error: err => {
        this.router.navigateByUrl('/login');
      }
    });
    //this.cargarConfiguracion();
  }

  ngAfterViewInit(): void {
  this.cargarConfiguracion();
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

  logout() {
    this.loginservicie.deleteToken();
    this.reiniciarConfiguracion();
    this.router.navigate(['/login']);
    //location.reload();
  }

  display: boolean = false;
//   onImgError(event: any) {
//     event.target.src = './assets/imgs/altImg.png'
// //Do other stuff with the event.target
//   }
  showDialog() {
    this.display = true;
  }
}
