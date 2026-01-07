import {
  nodeEndpointPort
} from "./chunk-T3SF7NHB.js";
import {
  exposeAPI
} from "./chunk-7GUL3OBQ.js";
import "./chunk-ZKJKRQKY.js";

// src/cubing/search/worker-workarounds/search-worker-entry.js
if (exposeAPI.expose) {
  (async () => {
    await import("./inside-K3VX2AIZ.js");
    const messagePort = globalThis.postMessage ? globalThis : await nodeEndpointPort();
    messagePort.postMessage("comlink-exposed");
  })();
}
var WORKER_ENTRY_FILE_URL = import.meta.url;
export {
  WORKER_ENTRY_FILE_URL
};
//# sourceMappingURL=search-worker-entry.js.map
