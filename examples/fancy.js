#!/usr/bin/env node -r esm

import { FancyReporter } from '../src'
import { reporterDemo } from './utils/demo'

reporterDemo(new FancyReporter({}))
