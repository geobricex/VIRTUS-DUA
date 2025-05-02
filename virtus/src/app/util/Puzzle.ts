import {QuestionUtils} from "./QuestionUtils";

export class Puzzle {

  private maxSizeImg: number = 75;
  private dimens: number = 3;

  public arrayImagePuzzle: string[][];
  public arrayPositionPuzzle: number[][];

  public primerMovimiento: number = 0;

  public puzzleControls: any = {
    complete: false,
    pressed: {x: -1, y: -1},
    release: {x: -1, y: -1}
  };

  crearPuzzle(cantidad: number, url: string): void {
    this.dimens = Math.sqrt(cantidad);

    let maxSizeImg = this.maxSizeImg * this.dimens;
    this.arrayImagePuzzle = new Array<string[]>(cantidad);
    this.arrayPositionPuzzle = new Array<number[]>(cantidad);
    let mecanvas = document.createElement("canvas") as HTMLCanvasElement;
    //let mecanvas = document.getElementById("tmpImagenCanvas") as HTMLCanvasElement;
    console.log(mecanvas);
    mecanvas.width = maxSizeImg;
    mecanvas.height = maxSizeImg;
    let ctx = mecanvas.getContext('2d')!;
    let local_this = this;
    let img = new Image();
    img.onload = function () {
      img.width = maxSizeImg;
      img.height = maxSizeImg;

      ctx.drawImage(img, 0, 0, maxSizeImg, maxSizeImg);
      let ind = 0;
      for (let y = 0; y < local_this.dimens; y++) {
        local_this.arrayImagePuzzle[y] = new Array<string>(local_this.dimens);
        local_this.arrayPositionPuzzle[y] = new Array<number>(local_this.dimens);
        for (let x = 0; x < local_this.dimens; x++) {
          let imgData = ctx.getImageData(x * local_this.maxSizeImg, y * local_this.maxSizeImg,
            (x * local_this.maxSizeImg) + local_this.maxSizeImg,
            (y * local_this.maxSizeImg) + local_this.maxSizeImg);
          let mincanvas = document.createElement("canvas") as HTMLCanvasElement;
          mincanvas.width = local_this.maxSizeImg;
          mincanvas.height = local_this.maxSizeImg;
          let minctx = mincanvas.getContext('2d')!;
          minctx.putImageData(imgData, 0, 0);

          // console.log("base64: ", mincanvas.toDataURL());
          local_this.arrayImagePuzzle[y][x] = mincanvas.toDataURL();
          local_this.arrayPositionPuzzle[y][x] = ind++;
        }
      }
      /*let imgData = ctx.getImageData(0, 0, local_this.maxSizeImg, local_this.maxSizeImg);
      let mincanvas = document.createElement("canvas") as HTMLCanvasElement;
      mincanvas.width = local_this.maxSizeImg;
      mincanvas.height = local_this.maxSizeImg;
      let minctx = mincanvas.getContext('2d')!;
      minctx.putImageData(imgData, 0, 0);

      console.log("base64: ", mincanvas.toDataURL());
      local_this.objImagePuzzle = mincanvas.toDataURL();*/
      let arrayDesorden: number[] = new Array<number>(local_this.dimens);
      for (let x = 0; x < local_this.dimens; x++) {
        arrayDesorden[x] = x;
      }
      //desordenar las filas
      for (let y = 0; y < local_this.dimens; y++) {
        arrayDesorden = QuestionUtils.desordenarRow(arrayDesorden);
        for (let x = 0; x < local_this.dimens; x++) {
          let changeimg: string, changeInd: number;
          changeimg = local_this.arrayImagePuzzle[y][arrayDesorden[x]];
          local_this.arrayImagePuzzle[y][arrayDesorden[x]] = local_this.arrayImagePuzzle[y][x];
          local_this.arrayImagePuzzle[y][x] = changeimg;

          changeInd = local_this.arrayPositionPuzzle[y][arrayDesorden[x]];
          local_this.arrayPositionPuzzle[y][arrayDesorden[x]] = local_this.arrayPositionPuzzle[y][x];
          local_this.arrayPositionPuzzle[y][x] = changeInd;
        }
      }
      //console.log("filas ", local_this.arrayPositionPuzzle);
      //desordenar las columnas
      for (let y = 0; y < local_this.dimens; y++) {
        arrayDesorden = QuestionUtils.desordenarRow(arrayDesorden);
        for (let x = 0; x < local_this.dimens; x++) {
          let changeimg: string, changeInd: number;
          changeimg = local_this.arrayImagePuzzle[arrayDesorden[x]][y];
          local_this.arrayImagePuzzle[arrayDesorden[x]][y] = local_this.arrayImagePuzzle[x][y];
          local_this.arrayImagePuzzle[x][y] = changeimg;

          changeInd = local_this.arrayPositionPuzzle[arrayDesorden[x]][y];
          local_this.arrayPositionPuzzle[arrayDesorden[x]][y] = local_this.arrayPositionPuzzle[x][y];
          local_this.arrayPositionPuzzle[x][y] = changeInd;
        }
      }
      //desordenar las filas
      for (let y = 0; y < local_this.dimens; y++) {
        arrayDesorden = QuestionUtils.desordenarRow(arrayDesorden);
        for (let x = 0; x < local_this.dimens; x++) {
          let changeimg: string, changeInd: number;
          changeimg = local_this.arrayImagePuzzle[y][arrayDesorden[x]];
          local_this.arrayImagePuzzle[y][arrayDesorden[x]] = local_this.arrayImagePuzzle[y][x];
          local_this.arrayImagePuzzle[y][x] = changeimg;

          changeInd = local_this.arrayPositionPuzzle[y][arrayDesorden[x]];
          local_this.arrayPositionPuzzle[y][arrayDesorden[x]] = local_this.arrayPositionPuzzle[y][x];
          local_this.arrayPositionPuzzle[y][x] = changeInd;
        }
      }
      //console.log("filas ", local_this.arrayPositionPuzzle);
      //desordenar las columnas
      for (let y = 0; y < local_this.dimens; y++) {
        arrayDesorden = QuestionUtils.desordenarRow(arrayDesorden);
        for (let x = 0; x < local_this.dimens; x++) {
          let changeimg: string, changeInd: number;
          changeimg = local_this.arrayImagePuzzle[arrayDesorden[x]][y];
          local_this.arrayImagePuzzle[arrayDesorden[x]][y] = local_this.arrayImagePuzzle[x][y];
          local_this.arrayImagePuzzle[x][y] = changeimg;

          changeInd = local_this.arrayPositionPuzzle[arrayDesorden[x]][y];
          local_this.arrayPositionPuzzle[arrayDesorden[x]][y] = local_this.arrayPositionPuzzle[x][y];
          local_this.arrayPositionPuzzle[x][y] = changeInd;
        }
      }

    };
    img.crossOrigin = "Anonymous";
    img.src = url;
  }

  mover(x: number, y: number) {
    if (!this.puzzleControls.complete) {
      this.puzzleControls.pressed = {x: x, y: y};
      this.puzzleControls.complete = true;
    } else {
      this.puzzleControls.released = {x: x, y: y};

      let auxInd = this.arrayPositionPuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x];
      this.arrayPositionPuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x] =
        this.arrayPositionPuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x];
      this.arrayPositionPuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x] = auxInd;

      let auxbase64 = this.arrayImagePuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x];
      this.arrayImagePuzzle[this.puzzleControls.released.y][this.puzzleControls.released.x] =
        this.arrayImagePuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x];
      this.arrayImagePuzzle[this.puzzleControls.pressed.y][this.puzzleControls.pressed.x] = auxbase64;

      //hacer truco de cambio
      this.puzzleControls.pressed = {x: -1, y: -1};
      this.puzzleControls.released = {x: -1, y: -1};
      this.puzzleControls.complete = false;

      /*if (!this.primerMovimiento) {
        this.primerMovimiento = true;
      }*/
      this.primerMovimiento++;
    }
  }

  isActive(x: number, y: number) {
    //if(!this.puzzleControls.complete){
    return (this.puzzleControls.pressed.x === x && this.puzzleControls.pressed.y === y);
    //(this.puzzleControls.rel.x === x && this.puzzleControls.pressed.y === y)
    /*}
    return false;*/
  }

  comprobarResultado(): number[] {
    let ind = 0, success = 0;
    for (let y = 0; y < this.dimens; y++) {
      if (this.arrayPositionPuzzle[y] !== undefined) {
        for (let x = 0; x < this.dimens; x++) {
          if (this.arrayPositionPuzzle[y][x] == ind) {
            success++; //fichas en el lugar correcto
          }
          ind++;
        }
      }
    }
    return [success, this.dimens * this.dimens];
  }
}
