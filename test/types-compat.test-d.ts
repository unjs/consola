import type { ConsolaInstance as CoreConsolaInstance } from "../src/consola";
import { createConsola } from "../src/index";

// Regression: https://github.com/unjs/consola/issues/382
const logger: CoreConsolaInstance = createConsola();

logger.info("ok");
