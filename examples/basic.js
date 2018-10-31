#!/usr/bin/env node -r esm

import { BasicReporter } from '../src'
import { reporterDemo } from './utils/demo'

reporterDemo(new BasicReporter({}))
