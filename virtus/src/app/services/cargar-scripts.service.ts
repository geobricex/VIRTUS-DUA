import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {

  constructor() { }

  loadingService(lFiles:string[]){
    for(let lFile of lFiles){
      let script = document.createElement("script");
      // //@ts-ignore
      // let dataFile = createFile("script");
      script.src = lFile ;//src/assets/scripts/js/pagemain
      let body = document.getElementsByTagName("body")[0];
      body.appendChild(script);
    }
  }
}
