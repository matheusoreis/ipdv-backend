export class BadRequestError extends Error {
    public readonly status = 400;

    constructor(message: string = "Requisição inválida") {
        super(message);
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
