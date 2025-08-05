export class UnauthorizedError extends Error {
  public readonly status = 401;

  constructor(message: string = "Não autorizado") {
    super(message);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
