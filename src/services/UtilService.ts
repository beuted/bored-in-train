export class UtilService {
  public static Shuffle<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  public static GetNumberSuite(N: number): number[] {
    return <number[]>(
      Array.apply(null, <any>{ length: N }).map(Function.call, Number)
    );
  }
}
