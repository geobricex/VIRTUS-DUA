import {Component, OnInit} from '@angular/core';
import {CargarScriptsService} from '../../services/cargar-scripts.service';
import {PrimeIcons} from 'primeng/api';

declare var Artyom: any;

@Component({
  selector: 'app-testvoice',
  templateUrl: './testvoice.component.html',
  styleUrls: ['./testvoice.component.css', './testvoice.component.scss']
})

export class TestvoiceComponent implements OnInit {

  private artyom: any = new Artyom();

  public element: any = {
    request: "¿Cual es el nombre del periferico preferido al momento de interactuar con la computadora?",
    options: [
      {
        "literal": "Literal A",
        "content": "Mouse",
        "response": false
      },
      {
        "literal": "Literal B",
        "content": "Impresora",
        "response": true
      },
      {
        "literal": "Literal C",
        "content": "teclado",
        "response": false
      }
    ]
  };

  public events1: any[];

  public literalSeleccionado: any;

  constructor(private _CargarScripts: CargarScriptsService) {
  }

  ngOnInit(): void {
    console.log("Load Test....");


    let microphoneApi: boolean = window.hasOwnProperty('webkitSpeechRecognition') && window.hasOwnProperty('speechSynthesis');
    console.log("Validar api de microfono: " + microphoneApi);

    this.events1 = [
      {status: 'No. 01', date: '15/10/2020 14:00', icon: PrimeIcons.CHECK, color: '#09b8b6'},
      {status: 'No. 02', date: '15/10/2020 16:15', icon: PrimeIcons.PENCIL, color: '#FF9800'},
      {status: 'No. 03', date: '16/10/2020 10:00', icon: PrimeIcons.CLOCK, color: '#607D8B'},
      {status: 'No. 04', date: '16/10/2020 10:00', icon: PrimeIcons.CLOCK, color: '#607D8B'}
    ];
  }

  ngAfterViewInit(): void {
    // Call the method creating a child component of class 'ComponentA' inside the template
    console.log("ejecutar despues de terminar carga");
    this.startContinuousArtyom();
  }

  changeRadio(): void {
    console.log("cambio", this.literalSeleccionado);
  }

  startContinuousArtyom(): void {

    //this.artyom.fatality();

    this.artyom.fatality();
    /*this.artyom.addCommands({
      indexes: ["Hello", "Hey", "Hurra"],
      action: function (i: any) {
        // i = index of the recognized option
        console.log("Something matches", i);
        //this.artyom.say("hola encontrado ");
      }
    });*/

    this.artyom.say("Iniciando todo...", {
      onStart: function () {
        console.log("Talking ...");
      },
      onEnd: function () {
        console.log("I said all that i knew");
      }
    });

    let myGroup: any = {
      description: "Si el usuario indica un literal que se encuentra en la lista",
      smart: true, // Activar comando como un comando smart para poder usar comodines
      indexes: ["literal *", "opción *"],
      action: function (i: number, wildcard: string) {
        let database: string[] = ["a", "b", "c", "d"];
        console.log("wilcardOriginal:" + wildcard);
        wildcard = wildcard.trim().replace(/[^a-zA-Z]+/, "");
        console.log("wildcard:", wildcard, i, database.indexOf(wildcard.trim()));
        if (database.indexOf(wildcard.trim()) > -1) {
          //this.artyom.say("Ha indicado la selección del literal " + wildcard);
          console.log("Ha indicado la selección del literal " + wildcard);
        } else {
          //this.artyom.say("No se encuentra ese literal");
          console.log("No se encuentra ese literal")
        }
      }
    };

    this.artyom.addCommands(myGroup);

    /*console.log("a la escucha");
    this.artyom.on(["Buenos días"]).then(function (i: any) {
      console.log("Triggered");
    });
    console.log("fin de la escucha");*/

    setTimeout(() => {
      //this.probarcomando();
      let btnStart = document.querySelector("#btnStart");
      if (btnStart) (btnStart as HTMLFormElement).click();
    }, 5000);

    // this.artyom.on(["hola"]).then(function (i: any) {
    //   console.log("Triggered");
    // });

    // this.artyom.redirectRecognizedTextOutput(function (recognized: string, isFinal: boolean) {
    //   if (isFinal) {
    //     console.log("Texto final reconocido: " + recognized);
    //   } else {
    //     console.log(recognized);
    //   }
    // });

    this.artyom.initialize({
      lang: "es-ES",
      continuous: true, // Artyom will listen forever
      debug: false, // Show what recognizes in the Console
      listen: true, // Start listening after this
      speed: 1, // Talk a little bit slow
      mode: "normal", // This parameter is not required as it will be normal by default,
      executionKeyword: "escucha"
    }).then(function () {
      console.log("artyom configurado...");
    });

  }

  probarcomando(): any {

    this.artyom.say("Buenos días, a continuación leeremos las preguntas");

    let reader: string = "";
    reader += this.element.request + " \n";
    //this.artyom.say(this.element.request);

    for (let i = 0; i < this.element.options.length; i++) {
      reader += this.element.options[i].literal + " \n";
      reader += this.element.options[i].content + " \n";
      if (i == -1) {
        console.log("Pure pure");
        /*this.artyom.on([this.element.options[i].literal]).then(function (e: any) {
          console.log("reconocido: ", e);
        });*/
      }
    }
    //console.log(reader);
    this.artyom.say(reader);
    //

    /*this.artyom.simulateInstruction("opción a");*/

    /*
        let UserDictation = this.artyom.newDictation({
          continuous: true, // Enable continuous if HTTPS connection
          onResult: function (text: string) {
            // Do something with the text
            console.log(text);
          },
          onStart: function () {
            console.log("Dictation started by the user");
          },
          onEnd: function () {
            alert("Dictation stopped by the user");
          }
        });

        UserDictation.start();
    */

  }
}
