#!/usr/bin/env node -r esm

import { BasicReporter } from '../src'
import { reporterDemo } from './_demo'

reporterDemo(new BasicReporter({}))
