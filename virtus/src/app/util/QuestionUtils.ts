export class QuestionUtils {

  public static desordenarRow(unArray: any[]): any[] {
    let t = unArray.sort(function (a, b) {
      return (Math.random() - 0.5)
    });
    return [...t];
  }

  public static contarClaves(data: any): number {
    if(data === undefined)
      return 0;
    return Object.keys(data).length;
  }

  public static isNullOrUndefined(data: any): boolean {
    return data === null || data === undefined;
  }
}
