import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {DashboardDemoComponent} from "./pages/dashboarddemo.component";
import {AppLoginComponent} from './pages/app.login.component';
import {AppMainpageComponent} from "./pages/app.mainpage.component";
import {AppMainComponent} from "./app.main.component";
import {AppNotfoundComponent} from "./pages/app.notfound.component";
import {CursosComponent} from './pages/cursos/cursos.component';
import {FavoritesComponent} from './pages/general/favorites/favorites.component';
import {MiscursosComponent} from "./pages/miscursos/miscursos.component";
import {TemasComponent} from "./pages/temas/temas.component";
import {SingupComponent} from "./pages/singup/singup.component";
import {ModuloComponent} from "./pages/modulo/modulo.component";
import {TestvoiceComponent} from './tests/testvoice/testvoice.component'
import {TestpocketbaseComponent} from './tests/testpocketbase/testpocketbase.component'
import {CursosArComponent} from "./pages/cursos-ar/cursos-ar.component";
import {CursosArInactiveComponent} from "./pages/cursos-ar-inactive/cursos-ar-inactive.component";
import {VerifyAccountComponent} from "./pages/verify-account/verify-account.component";
import {MyprofileComponent} from "./pages/myprofile/myprofile.component";
import {QuestionnaireComponent} from "./pages/questionnaire/questionnaire.component";
import {ModuloarComponent} from "./pages/moduloar/moduloar.component";
import {TopicarComponent} from "./pages/topicar/topicar.component";
import {ResourcesComponent} from "./pages/resources/resources.component";
import {ResourcesarComponent} from "./pages/resourcesar/resourcesar.component";
import {UseradministrationComponent} from "./pages/admins/useradministration/useradministration.component";
import {RequestssuggestionsComponent} from "./pages/admins/requestssuggestions/requestssuggestions.component";
import {EvaluationComponent} from "./pages/evaluation/evaluation.component";
import {IntentreviewComponent} from "./pages/reports/intentreview/intentreview.component";
import {ScorereportComponent} from "./pages/reports/scorereport/scorereport.component";
import {TimereportComponent} from "./pages/reports/timereport/timereport.component";
import {GamesComponent} from "./pages/games/games.component";
import {ReviewComponent} from "./pages/review/review.component";
import {UpdateevacuestComponent} from "./pages/updateevacuest/updateevacuest.component";
import {QuestionNuComponent} from "./pages/question-nu/question-nu.component";
import {AcercadeComponent} from "./pages/acercade/acercade.component";
import {ComandosComponent} from "./pages/comandos/comandos.component";
import {InformationArComponent} from "./pages/information-ar/information-ar.component";

import {GuarTokenGuard} from "./guards/guar-token.guard";
import {C} from "@angular/cdk/keycodes";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: 'login', component: AppLoginComponent},
      {path: 'singup', component: SingupComponent},
      {path: '', component: AppMainpageComponent, canActivate: [GuarTokenGuard]},
      {path: 'home', component: AppMainpageComponent, canActivate: [GuarTokenGuard]},
      {path: 'about', component: AcercadeComponent},
      {path: 'information', component: ComandosComponent},
      {path: 'verify/:email/:code', component: VerifyAccountComponent},
      {
        path: 'app', component: AppMainComponent,
        children: [
          {path: '', component: DashboardDemoComponent},
          // {path: 'games', component: GamesComponent},
          {path: 'about', component: AcercadeComponent},
          {path: 'information', component: ComandosComponent},
          {path: 'admins/informationar', component: InformationArComponent},
          {path: 'myprofile', component: MyprofileComponent},
          {path: 'course', component: CursosComponent},
          {path: 'general/favorites', component: FavoritesComponent},
          {path: 'coursear', component: CursosArComponent},
          {path: 'courseinactivear', component: CursosArInactiveComponent},
          {path: 'admins/useradministration', component: UseradministrationComponent},
          {path: 'admins/requestssuggestions', component: RequestssuggestionsComponent},
          {path: 'reports/timereport', component: TimereportComponent},
          {path: 'reports/scorereport', component: ScorereportComponent},
          {path: 'reports/intentreview', component: IntentreviewComponent},
          {path: 'reports/intentreview/review/:idReview', component: ReviewComponent},
          {path: 'coursear/modulear/:idcourse', component: ModuloarComponent},
          {path: 'coursear/modulear/:idcourse/topicar/:idmodule', component: TopicarComponent},
          {path: 'coursear/modulear/:idcourse/topicar/:idmodule/resourcesar/:idTopic', component: ResourcesarComponent},
          {
            path: 'coursear/modulear/:idcourse/topicar/:idmodule/resourcesar/:idTopic/update_evaluation/:idResource',
            component: UpdateevacuestComponent
          },
          {path: 'mycourse', component: MiscursosComponent},
          {
            path: 'mycourse/modules/:idcourse/themes/:idmodule/resources/:idTopic/questionnaire/:ideva',
            component: QuestionnaireComponent
          },
          {
            path: 'mycourse/modules/:idcourse/themes/:idmodule/resources/:idTopic/evaluation/:ideva',
            component: EvaluationComponent
          },
          {path: 'mycourse/modules/:idcourse', component: ModuloComponent},
          {path: 'mycourse/modules/:idcourse/themes/:idmodule', component: TemasComponent},
          {path: 'mycourse/modules/:idcourse/themes/:idmodule/resources/:idTopic', component: ResourcesComponent},
          {
            path: 'coursear/modulear/:idcourse/topicar/:idmodule/resourcesar/:idTopic/update_evaluation/:idResource/question_nu/:type/:idquestion',
            component: QuestionNuComponent
          }
        ]
      },
      // {path: 'testvoice', component: TestvoiceComponent},
      // {path: 'testpocket', component: TestpocketbaseComponent},
      {path: '**', component: AppNotfoundComponent},
    ], {scrollPositionRestoration: 'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
