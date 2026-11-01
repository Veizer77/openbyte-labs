import { runFrontendContentImport } from "./lib/frontend-content-importer";
import { loadLocalEnv } from "./lib/load-local-env";

loadLocalEnv();
void runFrontendContentImport();
