export class TrackingError extends Error {
  constructor(message = "Sesi tidak berlaku. Silakan masuk kembali.") {
    super(message);
    this.name = "TrackingError";
  }
}
