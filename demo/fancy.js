#!/usr/bin/env node -r esm

import { FancyReporter } from '../src'
import { reporterDemo } from './_demo'

reporterDemo(new FancyReporter({}))
