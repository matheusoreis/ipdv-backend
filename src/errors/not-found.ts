export class NotFoundError extends Error {
    public readonly status = 404;

    constructor(message: string = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
