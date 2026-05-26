import { stripVTControlCharacters } from "node:util";

import { setStripAnsiNative } from "./string";

setStripAnsiNative(stripVTControlCharacters);
