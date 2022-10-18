export class LoginObject {
  constructor(
    public identity: string,
    public password: string,
    public type: number,
    public socket: string
  ) { }
}
