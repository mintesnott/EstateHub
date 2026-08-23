class CustomAPIError extends Error {
  statusCode!: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default CustomAPIError;