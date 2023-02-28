import { IncomingRequest } from 'http'

type Options = {
  limit: number
}

export default {
  buffer(req: IncomingRequest, options?: Partial<Options>): typeof buffer;
  string(req: IncomingRequest, options?: Partial<Options>): string;
  json(req: IncomingRequest, options?: Partial<Options>): object;
  urlencoded(req: IncomingRequest, options?: Partial<Options>): object;
};
