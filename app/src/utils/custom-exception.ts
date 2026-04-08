export class CustomException extends Error {
  private status: number;

  constructor(message: string = "Bad Request", status: number = 400) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;
  }

  public getStatus(): number {
    return this.status;
  }
}
