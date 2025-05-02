import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {CookieService} from 'ngx-cookie-service';

import {AppLoginComponent} from './pages/app.login.component';
import {AppMainpageComponent} from './pages/app.mainpage.component';
import {VerifyAccountComponent} from './pages/verify-account/verify-account.component';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {AppMainComponent} from "./app.main.component";
import {AppTopBarComponent} from "./app.topbar.component";
import {AppMenuComponent} from "./app.menu.component";
import {AppMenuitemComponent} from "./app.menuitem.component";
import {AppBreadcrumbComponent} from "./app.breadcrumb.component";
import {AppFooterComponent} from "./app.footer.component";
import {RippleModule} from "primeng/ripple";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {DividerModule} from 'primeng/divider';
import {TimelineModule} from 'primeng/timeline';
import {CardModule} from 'primeng/card';
import {FieldsetModule} from 'primeng/fieldset';
import {BadgeModule} from 'primeng/badge';
import {SpeedDialModule} from 'primeng/speeddial';
import {TabViewModule} from 'primeng/tabview';
import {ColorPickerModule} from 'primeng/colorpicker';
import {PdfViewerModule} from 'ng2-pdf-viewer';

import {TagModule} from 'primeng/tag';
import {AvatarModule} from 'primeng/avatar';

//INICIO SERVICE
import {CargarScriptsService} from "./services/cargar-scripts.service";
// FIN SERVICES

import {AppComponent} from './app.component';
import {BreadcrumbService} from './app.breadcrumb.service';
import {MenuService} from './app.menu.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardDemoComponent} from "./pages/dashboarddemo.component";
import {CalendarModule} from "primeng/calendar";
import {PanelModule} from "primeng/panel";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextareaModule} from "primeng/inputtextarea";
import {TableModule} from "primeng/table";
import {FullCalendarModule} from "@fullcalendar/angular";
import {TestvoiceComponent} from './tests/testvoice/testvoice.component';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {AppNotfoundComponent} from "./pages/app.notfound.component";
import {CursosComponent} from './pages/cursos/cursos.component';
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {MiscursosComponent} from './pages/miscursos/miscursos.component';
import {TemasComponent} from './pages/temas/temas.component';
import {SingupComponent} from './pages/singup/singup.component';
import {DialogModule} from "primeng/dialog";
import {ModuloComponent} from './pages/modulo/modulo.component';
import {StorageService} from "./authentication/StorageService";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import {Utils} from "./util/Utils";
import {CursosArComponent} from './pages/cursos-ar/cursos-ar.component';
import {ToolbarModule} from "primeng/toolbar";
import {ChipModule} from "primeng/chip";
import {TestpocketbaseComponent} from './tests/testpocketbase/testpocketbase.component';
import {MyprofileComponent} from './pages/myprofile/myprofile.component';
import {QuestionnaireComponent} from './pages/questionnaire/questionnaire.component';
import {EvaluationComponent} from './pages/evaluation/evaluation.component';
import {AccordionModule} from "primeng/accordion";
import {RadioButtonModule} from "primeng/radiobutton";
import {ModuloarComponent} from './pages/moduloar/moduloar.component';
import {TopicarComponent} from './pages/topicar/topicar.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SidebarModule} from "primeng/sidebar";
import {ResourcesComponent} from './pages/resources/resources.component';
import {CarouselModule} from "primeng/carousel";
import {TooltipModule} from "primeng/tooltip";
import {ResourcesarComponent} from './pages/resourcesar/resourcesar.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {UseradministrationComponent} from './pages/admins/useradministration/useradministration.component';
import {InputNumberModule} from "primeng/inputnumber";

import {AppConfigComponent} from "./app.config.component";
import {ScrollTopModule} from "primeng/scrolltop";
import {ScrollPanelModule} from "primeng/scrollpanel";

import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
// ----- ICONOS DE FONTAWSOME ------
import {faHands,} from '@fortawesome/free-solid-svg-icons';

import {FavoritesComponent} from './pages/general/favorites/favorites.component';
import {FileUploadModule} from "primeng/fileupload";
import {RatingModule} from "primeng/rating";
import {SkeletonModule} from "primeng/skeleton";
import {IntentreviewComponent} from './pages/reports/intentreview/intentreview.component';
import {TimereportComponent} from './pages/reports/timereport/timereport.component';
import {ScorereportComponent} from './pages/reports/scorereport/scorereport.component';
import {RequestssuggestionsComponent} from './pages/admins/requestssuggestions/requestssuggestions.component';
import {ChartModule} from "primeng/chart";
import {CursosArInactiveComponent} from './pages/cursos-ar-inactive/cursos-ar-inactive.component';
import {GamesComponent} from './pages/games/games.component';
import {ReviewComponent} from './pages/review/review.component';
import {UpdateevacuestComponent} from './pages/updateevacuest/updateevacuest.component';
import {SelectButtonModule} from "primeng/selectbutton";
import {AutoCompleteModule} from "primeng/autocomplete";
import {QuestionNuComponent} from './pages/question-nu/question-nu.component';
import {SliderModule} from "primeng/slider";
// ---- COMANDO DE TECLADO -----
import {HotkeyModule} from 'angular2-hotkeys';
import {AcercadeComponent} from './pages/acercade/acercade.component';
import {ComandosComponent} from './pages/comandos/comandos.component';
import {InformationArComponent} from './pages/information-ar/information-ar.component';
// firebase
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AvatarGroupModule} from "primeng/avatargroup";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {GA_TOKEN} from "angular-ga";


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);


const firebaseConfig = {
  apiKey: "AIzaSyAbyfu-z_fCQITb4PjMK1XHuwXVeixDJWc",
  authDomain: "virtus-v1.firebaseapp.com",
  projectId: "virtus-v1",
  storageBucket: "virtus-v1.appspot.com",
  messagingSenderId: "636432508839",
  appId: "1:636432508839:web:8f5e7acb1f392068473882"
};

@NgModule({
  declarations: [
    AppComponent,
    AppMainComponent,
    AppMainpageComponent,
    AppLoginComponent,
    AppTopBarComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppBreadcrumbComponent,
    AppFooterComponent,
    DashboardDemoComponent,
    TestvoiceComponent,
    AppNotfoundComponent,
    CursosComponent,
    MiscursosComponent,
    TemasComponent,
    SingupComponent,
    ModuloComponent,
    CursosArComponent,
    TestpocketbaseComponent,
    VerifyAccountComponent,
    MyprofileComponent,
    QuestionnaireComponent,
    ModuloarComponent,
    TopicarComponent,
    ResourcesComponent,
    ResourcesarComponent,
    AppConfigComponent,
    UseradministrationComponent,
    EvaluationComponent,
    FavoritesComponent,
    IntentreviewComponent,
    TimereportComponent,
    ScorereportComponent,
    RequestssuggestionsComponent,
    CursosArInactiveComponent,
    GamesComponent,
    ReviewComponent,
    UpdateevacuestComponent,
    QuestionNuComponent,
    AcercadeComponent,
    ComandosComponent,
    InformationArComponent
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    FormsModule,
    CalendarModule,
    PanelModule,
    CheckboxModule,
    InputTextareaModule,
    TableModule,
    FullCalendarModule,
    DataViewModule,
    DropdownModule,
    DialogModule,
    MessagesModule,
    ToastModule,
    ToolbarModule,
    ChipModule,
    ReactiveFormsModule,
    RadioButtonModule,
    DividerModule,
    TimelineModule,
    CardModule,
    FieldsetModule,
    AccordionModule,
    BadgeModule,
    ConfirmDialogModule,
    SidebarModule,
    CarouselModule,
    TooltipModule,
    InputSwitchModule,
    SpeedDialModule,
    TabViewModule,
    InputNumberModule,
    ColorPickerModule,
    PdfViewerModule,
    ScrollTopModule,
    ScrollPanelModule,
    FontAwesomeModule,
    FileUploadModule,
    RatingModule,
    TagModule,
    SkeletonModule,
    ChartModule,
    AvatarModule,
    HotkeyModule.forRoot(),
    SelectButtonModule,
    AutoCompleteModule,
    SliderModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AvatarGroupModule,
    OverlayPanelModule
  ],

  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    MenuService, BreadcrumbService, CargarScriptsService, StorageService, MessageService,
    Utils, ConfirmationService, CookieService
    ,{
      provide: GA_TOKEN,
      useValue: 'G-LENK1MJDSX',
    },
  ],

  bootstrap: [AppComponent]
})

export class AppModule {

  constructor(
    private library: FaIconLibrary
  ) {
    library.addIcons(faHands);
  }
}
