import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
      <div class="layout-footer">
          <a href="#/app" class="logo-container">
              <img class="logo" alt="VIRTUS" src="assets/layout/images/imagesVirtus/logoSolo.svg"/>
              <span class="app-name">VIRTUS</span> <br>
              <span style="margin-left: 14px; color: white"> Aplicación educativa con enfoque universal. </span>
          </a>

          <div class="footer-icons">
              <ul>
                  <li>
                      <a href="https://www.facebook.com/fycuteq" target="_blank">
                          <i class="pi pi-facebook"></i>
                      </a>
                  </li>
                  <li>
                      <a href="https://www.youtube.com/playlist?list=PL2t9AygoxQ1u9Wjs_Im_CYUvK27DHk5Hq"
                         target="_blank">
                          <i class="pi pi-youtube"></i>
                      </a>
                  </li>
              </ul>
          </div>
      </div>
  `
})
export class AppFooterComponent {

}
