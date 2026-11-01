export type MediaErrorCode =
  "media_invalid" | "media_not_found" | "media_unavailable";

export class MediaServiceError extends Error {
  constructor(
    readonly code: MediaErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "MediaServiceError";
  }
}
