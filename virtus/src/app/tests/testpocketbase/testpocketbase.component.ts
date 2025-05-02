import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import PocketBase from 'pocketbase';
import {FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
// @ts-ignore
import { fabric } from "fabric";

//require('cross-fetch/polyfill');
declare const armadillo: any;

@Component({
  selector: 'app-testpocketbase',
  templateUrl: './testpocketbase.component.html',
  styleUrls: ['./testpocketbase.component.scss']
})
export class TestpocketbaseComponent implements OnInit {

  tokenAccess: string;
  elementsImg: any;
  testArmadillo: any;

  tmpFile: any;

  myForm = new FormGroup({
    field: new FormControl('', [Validators.required])
  });


  myGroup = new FormGroup({
    firstName: new FormControl()
  });

  //globalUri: string = "https://aplicaciones.uteq.edu.ec:9549";
  globalUri: string = "https://aplicaciones.uteq.edu.e/pocketbase";

  constructor(private _http: HttpClient) {
  }

  initPocket(): Observable<any> {
    return this.client.Admins.authViaEmail("anthony.pachay2017@uteq.edu.ec", "Abc1234567");
  }

  client: any;

  armarPárrafos(texto: string){
    let caracteresPorLinea = 50;
    let palabras: string[] = texto.split(" ");
    let lineas: string[] = [];
    let lastCorte: number = 0;
    let anterior = undefined;
    for(let i: number =0 ; i < palabras.length; i++){
      lastCorte = lastCorte == 0? 1: lastCorte;
      let actual = palabras.slice(lastCorte - 1, i).join(" ");
      if(actual.length > caracteresPorLinea)
      {
        if(anterior != undefined) {
          lineas.push(anterior);
        }
        lastCorte = i
      }
      anterior = actual;
    }
    lineas.push(anterior!);
    console.log("########  RESULTADOS    #######")
    console.log(lineas);
    return lineas.join("\n");
  }

  makeCircle(left:any, top:any, line1:any, line2:any, line3:any, line4:any) {
    let c = new fabric.Circle({
      left: left - 6,
      top: top - 6,
      strokeWidth: 2,
      radius: 8,
      fill: line1 == undefined?'#fff':'gray',
      stroke: '#666',
      selectable: line1 == undefined? false: true,
    });
    c.hasControls = c.hasBorders = false;
    // @ts-ignore
    c.line1 = line1;
    // @ts-ignore
    c.line2 = line2;
    // @ts-ignore
    c.line3 = line3;
    // @ts-ignore
    c.line4 = line4;

    return c;
  }

  makeLine(coords:number[]) {
    return new fabric.Line(coords, {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 6,
      selectable: false,
      evented: false,
    });
  }

  makeElement(canvasLineas: fabric.Canvas, text: any, image:any, numX:number, numY:number, recurso: boolean){
    var rect = new fabric.Rect({
      left: numX * 450,
      top: numY * 105,
      fill: '#ffeaa7',
      width: (recurso? 250:160),
      height: 100,
      evented: false,
      selectable: false
    });


    var txt = new fabric.Textbox(text, {
      left: (recurso? 95: 5) + (numX * 450),
      top: 5 + (numY * 105),
      fill: 'black',
      width: 150,
      fontSize:14,
      evented: false,
      selectable: false
    });
    canvasLineas.add(rect);
    canvasLineas.add(txt);
    if(recurso) {
      fabric.Image.fromURL(image, function (img: any) {

        function determineNewHeight(originalHeight: number, originalWidth: number, newWidth: number) {
          return (originalHeight / originalWidth) * newWidth;
        }

        let local_width = 85, local_height = 85;
        if (img.width! > img.height!) {
          local_height = determineNewHeight(img.width!, img.height!, local_width);
        } else {
          local_width = determineNewHeight(img.height!, img.width!, local_width);
        }
        img.set({
          scaleX: local_width / img.width!,
          scaleY: local_height / img.height!,
          originX: 'left', originY: 'top'
        });
        canvasLineas.add(img);
      }, {
        left: 5 + (numX * 450),
        top: 5 + (numY * 105),
        evented: false,
        selectable: false
      });
    }
    if(numX != 1) {
      let line = this.makeLine([
        //150 + 5 + 5 + 6
        (numX == 0 ? (recurso ? 250 - 3: 160 - 3) : 450), (numY * 100) + 50 + (5 * numY) / 2,
        (numX == 0 ? (recurso ? 300 : 210) : 400), (numY * 100) + 50 + (5 * numY) / 2
      ]);
      canvasLineas.add(line);
      // @ts-ignore
      let circleInicio = this.makeCircle(line.get('x1'), line.get('y1'), null);
      canvasLineas.add(circleInicio);
      // @ts-ignore
      let circleFin = this.makeCircle(line.get('x2'), line.get('y2'), line);
      canvasLineas.add(circleFin);
      this.joinLineIzquierda.push(circleFin);
    } else{
      // @ts-ignore
      let circle = this.makeCircle(450 - 10, (numY * 100) + 50 + (5 * numY) / 2, null);
      canvasLineas.add(circle);
      this.joinLineDerecha.push(circle);
    }
  }

  public joinLineDerecha: fabric.Circle[] = []
  public joinLineIzquierda: fabric.Circle[] = [];

  ngOnInit(): void {
      let canvasLineas = new fabric.Canvas('canvasLineas', {
        backgroundColor: "white"
      });
      canvasLineas.selection = false;
      console.log("ok", canvasLineas);

    let literales = [
      {
        url: 'https://res.cloudinary.com/dtkeikdwd/image/upload/v1624861354/public/capooo_gzfgfl.jpg',
        text: 'Saludos amigos mios, como se encuentran en este hermoso dia'
      }
    ];

    this.makeElement(canvasLineas, literales[0].text, literales[0].url, 0, 0, true);
    this.makeElement(canvasLineas, literales[0].text, literales[0].url, 0, 1, false);

    this.makeElement(canvasLineas, literales[0].text, literales[0].url, 1, 0, false);
    this.makeElement(canvasLineas, literales[0].text, literales[0].url, 1, 1, false);
    this.makeElement(canvasLineas, literales[0].text, literales[0].url, 1, 2, true);

    let joinLineElements = this.joinLineDerecha;
    let joinLineElementsIz = this.joinLineIzquierda;

    canvasLineas.on('object:moving', function(e: any) {
      let p = e.target;
      //console.log(p);
      // @ts-ignore
      p['line1'] && p['line1'].set({ 'x2': p.left + 6, 'y2': p.top + 6});
      canvasLineas.renderAll();
    });

    canvasLineas.on('mouse:down', function(e: any){
      let p = e.target;
      console.log("me has clickeado tio", p);
      for (let ind = 0; ind < joinLineElementsIz.length; ind++){
        if(p!.intersectsWithObject(joinLineElementsIz[ind])){
          console.log("Clic elemento: " + ind);
        }
      }
    });

    canvasLineas.on('mouse:up', function(e: any){
      let p = e.target;
      console.log("me has soltado tio", p);
      let inserTecta = false;
      for (let ind = 0; ind < joinLineElements.length; ind++){
        if(p!.intersectsWithObject(joinLineElements[ind])){
          console.log("coindice con la posición: " + ind);
          inserTecta = true;
        }
      }
      if(inserTecta){
        p!.set({'fill':'blue'});
        canvasLineas.renderAll();
      }else{
        p!.set({'fill':'white'});
        canvasLineas.renderAll();
      }
    });

    /*
    // @ts-ignore
    this.testArmadillo = getHackDiagram("This use case starts when a person *(person &-id=int) wants to register as a tutor *(tutor &-id=int [+userRegistration=Tutor]) user in the system. *¡(tutor)<>*(Person)¡")

    console.log(
      // @ts-ignore
      this.testArmadillo[1]
    )
    this.client = new PocketBase(this.globalUri);
    console.log(" -- -- ");
    let resp = this.initPocket();
    console.log(resp);

    //let listaImg = this.listarImagenes();
    //console.log(listaImg);
    this.listarImagenes().then(listas => {
      console.log("listas: ", listas);
      this.elementsImg = listas.items;
    });
*/

    /*this.initPocketBase().subscribe(response => {
      // do some action
      this.tokenAccess = response.token;
      console.log("inicio: ", response.token);
      this.listarImagenes(response.token).subscribe(listas => {
        console.log("listas: ", listas);
        this.elementsImg = listas.items;
      });
      //this.pathImg = this.mostarImagen(response.token, "BNLvZsE9FS7qy5M");
      //console.log("pathImg: " + this.pathImg);

    });*/

  }


  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.tmpFile = file;
      this.myForm.patchValue({
        field: file
      });
    }
  }

  guardarArchivo() {
    console.log(this.tmpFile);
    if (this.tmpFile != undefined) {
      /*this.insetarImagenes(this.tokenAccess).subscribe(response => {
        console.log("resultado: ", response);
      });*/
      this.insetarImagenes2().then(respuesta => {
        console.log("respuesta: ", respuesta);
        console.log(this.makePathRecurso(respuesta));
      });
    }
  }

  async insetarImagenes2(): Promise<any> {

    let formData01 = new FormData();
    formData01.append('field', this.tmpFile);
    //console.log("test02", typeof (this.tmpFile), this.tmpFile);
    return await this.client.Records.create("archivos", formData01);
  }

  async listarImagenes(): Promise<any> {
    return await this.client.Records.getList("archivos", 1, 20);
  }


  /*REST*/

  initPocketBaseRest(): Observable<any> {
    var urltoken: string = this.globalUri + "/api/admins/auth-via-email";
    var headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*');
    return this._http.post(urltoken, {
      "email": "anthony.pachay2017@uteq.edu.ec",
      "password": "Abc1234567"
    }, {'headers': headers});
  }

  listarImagenesRest(token: string): Observable<any> {
    var urlServicio: string = this.globalUri + "/api/collections/archivos/records?page=1&perPage=10";// +"/GPPzWD6nnKtS8ZK" ;
    var headers = new HttpHeaders()//.set('Content-Type', 'application/json')
      .set('Authorization', 'Admin ' + token);
    return this._http.get(urlServicio, {headers: headers});
  }

  makePathRecurso(element: any): string {
    //var urlServicio: string = globalUri + "/api/collections/archivos/records/" + idImagen + "?expand=rel1,rel2.subrel21.subrel22";// +"/" ;
    var urlRecurso: string = this.globalUri + "/api/files/" + element["@collectionName"] + "/" + element.id + "/" + element.field;// +"/" ;
    //console.log(urlRecurso);
    return urlRecurso;
  }


  insetarImagenesRest(token: string): Observable<any> {

    let formData01 = new FormData();

    console.log("test02", typeof (this.tmpFile), this.tmpFile);
    formData01.append('file', this.myForm.get('field')?.value);

    var urlServicio: string = this.globalUri + "/api/collections/archivos/records";
    var headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')
      .set('Authorization', 'Admin ' + token);
    return this._http.post(urlServicio, formData01, {headers: headers});

  }

  insetarJsonRest(token: string): Observable<any> {
    var urlServicio: string = this.globalUri + "/api/collections/archivos/records";
    var headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', 'Admin ' + token);
    let objectJson = JSON.stringify({
      "nombre": "anthony"
    });
    return this._http.post(urlServicio, objectJson, {headers: headers});
  }

  interpreteTest() {

  }

}
