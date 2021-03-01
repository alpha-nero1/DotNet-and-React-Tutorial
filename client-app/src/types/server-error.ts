export class ServerError {
  statusCode?: number;
  message?: string;
  details?: string;

  constructor(opts?: Partial<ServerError>) {
    if (opts) {
      Object.assign(this, opts);
    }
  }
}