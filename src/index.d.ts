import { IncomingRequest } from 'http'

type Options = {
  limit: number
}

export default {
  buffer(req: IncomingRequest, options: Options): typeof buffer;
  string(req: IncomingRequest, options: Options): string;
  json(req: IncomingRequest, options: Options): object;
  urlencoded(req: IncomingRequest, options: Options): object;
};
