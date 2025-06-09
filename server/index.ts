
// server/index.ts

import { handleRequest } from "./api/agentRunner";

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  },
};
