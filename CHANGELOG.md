# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## v3.2.2

[compare changes](https://github.com/unjs/consola/compare/v3.2.1...v3.2.2)


### 🩹 Fixes

  - **fancy:** Add node 14 compatibility ([#204](https://github.com/unjs/consola/pull/204))

### 📦 Build

  - **pkg:** Add supported engines field ([#179](https://github.com/unjs/consola/pull/179))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v3.2.1

[compare changes](https://github.com/unjs/consola/compare/v3.2.0...v3.2.1)


### 🩹 Fixes

  - **box:** Fix preset naming for `singleThick` ([#201](https://github.com/unjs/consola/pull/201))
  - **fancy:** Style underscore with surrounding spaces ([#203](https://github.com/unjs/consola/pull/203))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Christian Preston ([@cpreston321](http://github.com/cpreston321))

## v3.2.0

[compare changes](https://github.com/unjs/consola/compare/v3.1.0...v3.2.0)


### 🚀 Enhancements

  - **fancy:** Support underlining ([#191](https://github.com/unjs/consola/pull/191))
  - `consola.box` ([#193](https://github.com/unjs/consola/pull/193))
  - `consola/utils` subpath export ([#199](https://github.com/unjs/consola/pull/199))
  - Color utils ([#200](https://github.com/unjs/consola/pull/200))

### 🩹 Fixes

  - Inherit mocks ([#183](https://github.com/unjs/consola/pull/183))
  - Correct and improve return types for single and multi select prompts ([#197](https://github.com/unjs/consola/pull/197))
  - Preserve tag casing ([#190](https://github.com/unjs/consola/pull/190))

### 🏡 Chore

  - Update prompt example ([#196](https://github.com/unjs/consola/pull/196))
  - Lint code ([d424218](https://github.com/unjs/consola/commit/d424218))
  - Update dependencies ([dabb705](https://github.com/unjs/consola/commit/dabb705))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Christian Preston ([@cpreston321](http://github.com/cpreston321))
- Leex ([@jsonleex](http://github.com/jsonleex))
- Inesh Bose 
- Damian Głowala

## v3.1.0

[compare changes](https://github.com/unjs/consola/compare/v3.0.2...v3.1.0)


### 🚀 Enhancements

  - Support `fancy` option for `createConsola` and improve docs ([#177](https://github.com/unjs/consola/pull/177))
  - `/basic`, `/core` and `/browser` subpath exports ([#178](https://github.com/unjs/consola/pull/178))

### 🏡 Chore

  - Add json example ([943992d](https://github.com/unjs/consola/commit/943992d))
  - Update the docs ([a952bc2](https://github.com/unjs/consola/commit/a952bc2))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v3.0.2

[compare changes](https://github.com/unjs/consola/compare/v3.0.1...v3.0.2)


### 🩹 Fixes

  - **`mockTypes`:** Mock on `options.typs` ([f9d86b6](https://github.com/unjs/consola/commit/f9d86b6))
  - Type `.raw` for types ([dfb976f](https://github.com/unjs/consola/commit/dfb976f))

### 💅 Refactors

  - Use individual named exports of reporters ([57bb579](https://github.com/unjs/consola/commit/57bb579))

### 🏡 Chore

  - Add `codecov.yml` ([1f50123](https://github.com/unjs/consola/commit/1f50123))
  - Update readme ([5a4708d](https://github.com/unjs/consola/commit/5a4708d))
  - Fix mock example ([4dadfb3](https://github.com/unjs/consola/commit/4dadfb3))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v3.0.1

[compare changes](https://github.com/unjs/consola/compare/v3.0.0...v3.0.1)


### 🩹 Fixes

  - **utils:** Use default `stream.write` for workers support ([#173](https://github.com/unjs/consola/pull/173))
  - Wrap `options.stdout` and `options.stderr` for wrapStd ([ab59db6](https://github.com/unjs/consola/commit/ab59db6))

### 💅 Refactors

  - **fancy:** More minimal badges when width cannot be determined ([ad24029](https://github.com/unjs/consola/commit/ad24029))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v3.0.0

[compare changes](https://github.com/unjs/consola/compare/v2.15.2...v3.0.0)


### 🚀 Enhancements

  - Default `logLevel` to 1 in test environments ([#134](https://github.com/unjs/consola/pull/134))
  - Support literal for logLevels ([#133](https://github.com/unjs/consola/pull/133))
  - Expose `createConsola` and named exports ([ef6e5e5](https://github.com/unjs/consola/commit/ef6e5e5))
  - `consola.prompt` util ([#170](https://github.com/unjs/consola/pull/170))
  - `consola.fail` log level ([#153](https://github.com/unjs/consola/pull/153))
  - Pass `formatOptions` and other options to reporters ([d77286a](https://github.com/unjs/consola/commit/d77286a))
  - Show stack trace with `consola.trace` ([#151](https://github.com/unjs/consola/pull/151))

### 🔥 Performance

  - Switch from chalk to colorette ([271b4db](https://github.com/unjs/consola/commit/271b4db))
  - Remove `dayjs` dependency ([d6a3776](https://github.com/unjs/consola/commit/d6a3776))

### 🩹 Fixes

  - Add `.raw` to mocked functions ([987dadc](https://github.com/unjs/consola/commit/987dadc))
  - Type consola instance with built-in type functions ([1a4b893](https://github.com/unjs/consola/commit/1a4b893))
  - Default value for color format utils ([ec9be78](https://github.com/unjs/consola/commit/ec9be78))
  - **fancy:** Show time and tag on right when width cannot be determined ([#128](https://github.com/unjs/consola/pull/128))
  - Pass level from `CONSOLA_LEVEL` to the `defaults` ([#129](https://github.com/unjs/consola/pull/129))
  - **consola:** Type defaults overrides generic defaults ([d3d3c05](https://github.com/unjs/consola/commit/d3d3c05))
  - **fancy:** Improve colors ([99c2a4f](https://github.com/unjs/consola/commit/99c2a4f))
  - **promp:** Options is optional ([817626f](https://github.com/unjs/consola/commit/817626f))

### 💅 Refactors

  - ⚠️  Rewrite consola with typescript ([4479d2f](https://github.com/unjs/consola/commit/4479d2f))
  - Rename `global` to `globalThis` ([bd03098](https://github.com/unjs/consola/commit/bd03098))
  - **utils:** Rename `global` to `globalThis` ([8c3ef77](https://github.com/unjs/consola/commit/8c3ef77))
  - Strict typechecks ([63bbd56](https://github.com/unjs/consola/commit/63bbd56))
  - Remove `globalThis` caching ([4e7b909](https://github.com/unjs/consola/commit/4e7b909))
  - Drop `json` and `winston` reporters ([5af0e99](https://github.com/unjs/consola/commit/5af0e99))
  - Move all options to `consola.options` without duplication ([2d31ef4](https://github.com/unjs/consola/commit/2d31ef4))
  - Move spam logic into `_lastLog` object ([cabd04f](https://github.com/unjs/consola/commit/cabd04f))
  - Remove global `async` option ([edd1bb9](https://github.com/unjs/consola/commit/edd1bb9))
  - **types:** Merge `LogTypeLiteral` and `logtype` types to `LogType` ([da1bc73](https://github.com/unjs/consola/commit/da1bc73))
  - ⚠️  Move log levels and types to constants ([514f5b3](https://github.com/unjs/consola/commit/514f5b3))
  - Use `index.node.ts` for main build ([b92d23b](https://github.com/unjs/consola/commit/b92d23b))
  - Improve types  and exports ([b380d21](https://github.com/unjs/consola/commit/b380d21))
  - Improve fancy reporter ([bc90db8](https://github.com/unjs/consola/commit/bc90db8))
  - Revert back to `dist/index.*` for bw compatibility ([98e300f](https://github.com/unjs/consola/commit/98e300f))
  - **fancy:** Better start color and icon ([5a01d53](https://github.com/unjs/consola/commit/5a01d53))

### 📖 Documentation

  - Fix links to the source files ([#172](https://github.com/unjs/consola/pull/172))

### 📦 Build

  - Use backward compatible cjs wrapper for default export ([e2e6aa6](https://github.com/unjs/consola/commit/e2e6aa6))

### 🏡 Chore

  - **release:** 2.15.3 ([c99ff6c](https://github.com/unjs/consola/commit/c99ff6c))
  - Make example/index.js working ([#110](https://github.com/unjs/consola/pull/110))
  - Add LICENSE ([#121](https://github.com/unjs/consola/pull/121))
  - **npm:** Update repository to unjs orgnization ([#125](https://github.com/unjs/consola/pull/125))
  - Add prerelease script ([cfaba5e](https://github.com/unjs/consola/commit/cfaba5e))
  - Hide rollup warn ([5c3b7f1](https://github.com/unjs/consola/commit/5c3b7f1))
  - Ignore coverage ([da557ac](https://github.com/unjs/consola/commit/da557ac))
  - Update examples ([e07e3ab](https://github.com/unjs/consola/commit/e07e3ab))
  - **release:** V3.0.0-1 ([c24ae27](https://github.com/unjs/consola/commit/c24ae27))
  - Rename dist-tag to 3.x ([3e8f1e0](https://github.com/unjs/consola/commit/3e8f1e0))
  - Update readme ([85bbe3a](https://github.com/unjs/consola/commit/85bbe3a))
  - Update badges ([cf7c6e5](https://github.com/unjs/consola/commit/cf7c6e5))
  - Update badges ([566ff68](https://github.com/unjs/consola/commit/566ff68))
  - **release:** V3.0.0-2 ([4a01304](https://github.com/unjs/consola/commit/4a01304))
  - Update shared exports ([8fc0fdd](https://github.com/unjs/consola/commit/8fc0fdd))
  - **release:** V3.0.0-3 ([6253fb0](https://github.com/unjs/consola/commit/6253fb0))
  - Fix import in examples ([c4fff18](https://github.com/unjs/consola/commit/c4fff18))
  - **release:** V3.0.0-4 ([474f82f](https://github.com/unjs/consola/commit/474f82f))
  - **release:** V3.0.0-5 ([ad20f89](https://github.com/unjs/consola/commit/ad20f89))
  - Add example for readme ([2bb5813](https://github.com/unjs/consola/commit/2bb5813))
  - Update readme ([0568e61](https://github.com/unjs/consola/commit/0568e61))
  - Update readme ([6a5fb0c](https://github.com/unjs/consola/commit/6a5fb0c))
  - Lint changelog ([11ba5be](https://github.com/unjs/consola/commit/11ba5be))
  - Update package.json ([f698f88](https://github.com/unjs/consola/commit/f698f88))
  - Remove browser cjs ([a5db8db](https://github.com/unjs/consola/commit/a5db8db))
  - Update release script to normal ([2634c71](https://github.com/unjs/consola/commit/2634c71))

### ✅ Tests

  - Update test ([64fa81d](https://github.com/unjs/consola/commit/64fa81d))

### 🎨 Styles

  - Prefer object spread instead of `Object.assign` ([c03268a](https://github.com/unjs/consola/commit/c03268a))

#### ⚠️  Breaking Changes

  - ⚠️  Rewrite consola with typescript ([4479d2f](https://github.com/unjs/consola/commit/4479d2f))
  - ⚠️  Move log levels and types to constants ([514f5b3](https://github.com/unjs/consola/commit/514f5b3))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- With-heart ([@with-heart](http://github.com/with-heart))
- Anthony Fu <anthonyfu117@hotmail.com>
- Xin Du (Clark) <clark.duxin@gmail.com>
- Sébastien Chopin <seb@nuxtjs.com>
- Thomas K ([@ThomasKoscheck](http://github.com/ThomasKoscheck))

## v3.0.0-5

[compare changes](https://github.com/unjs/consola/compare/v3.0.0-4...v3.0.0-5)

### 🩹 Fixes

- **fancy:** Improve colors ([99c2a4f](https://github.com/unjs/consola/commit/99c2a4f))

### 💅 Refactors

- **fancy:** Better start color and icon ([5a01d53](https://github.com/unjs/consola/commit/5a01d53))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v3.0.0-4

[compare changes](https://github.com/unjs/consola/compare/v3.0.0-3...v3.0.0-4)

### 🚀 Enhancements

- `consola.fail` log level ([#153](https://github.com/unjs/consola/pull/153))
- Pass `formatOptions` and other options to reporters ([d77286a](https://github.com/unjs/consola/commit/d77286a))
- Show stack trace with `consola.trace` ([#151](https://github.com/unjs/consola/pull/151))

### 🩹 Fixes

- Type consola instance with built-in type functions ([1a4b893](https://github.com/unjs/consola/commit/1a4b893))
- Default value for color format utils ([ec9be78](https://github.com/unjs/consola/commit/ec9be78))
- **fancy:** Show time and tag on right when width cannot be determined ([#128](https://github.com/unjs/consola/pull/128))
- Pass level from `CONSOLA_LEVEL` to the `defaults` ([#129](https://github.com/unjs/consola/pull/129))
- **consola:** Type defaults overrides generic defaults ([d3d3c05](https://github.com/unjs/consola/commit/d3d3c05))

### 💅 Refactors

- Drop `json` and `winston` reporters ([5af0e99](https://github.com/unjs/consola/commit/5af0e99))
- Move all options to `consola.options` without duplication ([2d31ef4](https://github.com/unjs/consola/commit/2d31ef4))
- Move spam logic into `_lastLog` object ([cabd04f](https://github.com/unjs/consola/commit/cabd04f))
- Remove global `async` option ([edd1bb9](https://github.com/unjs/consola/commit/edd1bb9))
- **types:** Merge `LogTypeLiteral` and `logtype` types to `LogType` ([da1bc73](https://github.com/unjs/consola/commit/da1bc73))
- ⚠️ Move log levels and types to constants ([514f5b3](https://github.com/unjs/consola/commit/514f5b3))
- Use `index.node.ts` for main build ([b92d23b](https://github.com/unjs/consola/commit/b92d23b))
- Improve types and exports ([b380d21](https://github.com/unjs/consola/commit/b380d21))
- Improve fancy reporter ([bc90db8](https://github.com/unjs/consola/commit/bc90db8))
- Revert back to `dist/index.*` for bw compatibility ([98e300f](https://github.com/unjs/consola/commit/98e300f))

### 📖 Documentation

- Fix links to the source files ([#172](https://github.com/unjs/consola/pull/172))

### 🏡 Chore

- Fix import in examples ([c4fff18](https://github.com/unjs/consola/commit/c4fff18))

### ✅ Tests

- Update test ([64fa81d](https://github.com/unjs/consola/commit/64fa81d))

### 🎨 Styles

- Prefer object spread instead of `Object.assign` ([c03268a](https://github.com/unjs/consola/commit/c03268a))

#### ⚠️ Breaking Changes

- ⚠️ Move log levels and types to constants ([514f5b3](https://github.com/unjs/consola/commit/514f5b3))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- With-heart ([@with-heart](http://github.com/with-heart))

## v3.0.0-3

[compare changes](https://github.com/unjs/consola/compare/v3.0.0-2...v3.0.0-3)

### 💅 Refactors

- Remove `globalThis` caching ([4e7b909](https://github.com/unjs/consola/commit/4e7b909))

### 📦 Build

- Use backward compatible cjs wrapper for default export ([e2e6aa6](https://github.com/unjs/consola/commit/e2e6aa6))

### 🏡 Chore

- Update shared exports ([8fc0fdd](https://github.com/unjs/consola/commit/8fc0fdd))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v3.0.0-2

[compare changes](https://github.com/unjs/consola/compare/v3.0.0-1...v3.0.0-2)

### 🚀 Enhancements

- `consola.prompt` util ([#170](https://github.com/unjs/consola/pull/170))

### 🏡 Chore

- Rename dist-tag to 3.x ([3e8f1e0](https://github.com/unjs/consola/commit/3e8f1e0))
- Update readme ([85bbe3a](https://github.com/unjs/consola/commit/85bbe3a))
- Update badges ([cf7c6e5](https://github.com/unjs/consola/commit/cf7c6e5))
- Update badges ([566ff68](https://github.com/unjs/consola/commit/566ff68))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v3.0.0-1

[compare changes](https://github.com/unjs/consola/compare/v2.15.3...v3.0.0-1)

>

### 🚀 Enhancements

- Default `logLevel` to 1 in test environments ([#134](https://github.com/unjs/consola/pull/134))
- Support literal for logLevels ([#133](https://github.com/unjs/consola/pull/133))
- Expose `createConsola` and named exports ([ef6e5e5](https://github.com/unjs/consola/commit/ef6e5e5))

### 🔥 Performance

- Switch from chalk to colorette ([271b4db](https://github.com/unjs/consola/commit/271b4db))
- Remove `dayjs` dependency ([d6a3776](https://github.com/unjs/consola/commit/d6a3776))

### 💅 Refactors

- ⚠️ Rewrite consola with typescript ([4479d2f](https://github.com/unjs/consola/commit/4479d2f))
- Rename `global` to `globalThis` ([bd03098](https://github.com/unjs/consola/commit/bd03098))
- **utils:** Rename `global` to `globalThis` ([8c3ef77](https://github.com/unjs/consola/commit/8c3ef77))
- Strict typechecks ([63bbd56](https://github.com/unjs/consola/commit/63bbd56))

### 🏡 Chore

- Make example/index.js working ([#110](https://github.com/unjs/consola/pull/110))
- Add LICENSE ([#121](https://github.com/unjs/consola/pull/121))
- **npm:** Update repository to unjs orgnization ([#125](https://github.com/unjs/consola/pull/125))
- Add prerelease script ([cfaba5e](https://github.com/unjs/consola/commit/cfaba5e))
- Hide rollup warn ([5c3b7f1](https://github.com/unjs/consola/commit/5c3b7f1))
- Ignore coverage ([da557ac](https://github.com/unjs/consola/commit/da557ac))
- Update examples ([e07e3ab](https://github.com/unjs/consola/commit/e07e3ab))

#### ⚠️ Breaking Changes

- ⚠️ Rewrite consola with typescript ([4479d2f](https://github.com/unjs/consola/commit/4479d2f))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Anthony Fu <anthonyfu117@hotmail.com>
- Xin Du (Clark) <clark.duxin@gmail.com>
- Sébastien Chopin <seb@nuxtjs.com>
- Thomas K ([@ThomasKoscheck](http://github.com/ThomasKoscheck))

### [2.15.3](https://github.com/unjs/consola/compare/v2.15.2...v2.15.3) (2021-02-07)

### Bug Fixes

- add `.raw` to mocked functions ([987dadc](https://github.com/unjs/consola/commit/987dadcc81a82698051ade2384ae2f0fc12d8aef))

### [2.15.2](https://github.com/unjs/consola/compare/v2.15.1...v2.15.2) (2021-02-03)

### Bug Fixes

- add isRaw flag only for wrapped calls ([23b1184](https://github.com/unjs/consola/commit/23b1184e2897f5d33943bec7180fb2427402d400)), closes [unjs/unjs.js#8752](https://github.com/unjs/unjs.js/issues/8752)

### [2.15.1](https://github.com/unjs/consola/compare/v2.15.0...v2.15.1) (2021-02-02)

### Bug Fixes

- skip logObj check for wrapped calls (fixes [#109](https://github.com/unjs/consola/issues/109)) ([091a244](https://github.com/unjs/consola/commit/091a24423bb9c28b7371e7af849b15c7e39747fa))

## [2.15.0](https://github.com/unjs/consola/compare/v2.14.0...v2.15.0) (2020-08-05)

### Features

- **types:** use union type for `ConsolaLogObject.type` ([#100](https://github.com/unjs/consola/issues/100)) ([a6eba53](https://github.com/unjs/consola/commit/a6eba532381bcec9c84ac5600ac668aca87c8487))
- support `formatOptions.date` to optionally hide date ([#101](https://github.com/unjs/consola/issues/101)) ([6bf733f](https://github.com/unjs/consola/commit/6bf733f2b9a5320584bdd0de7de08f4341c74335))

## [2.14.0](https://github.com/unjs/consola/compare/v2.13.0...v2.14.0) (2020-06-26)

### Features

- improve spam throttle ([5314eee](https://github.com/unjs/consola/commit/5314eeebb4b564408a4ab14cb457bdbd426f6124))

## [2.13.0](https://github.com/unjs/consola/compare/v2.12.2...v2.13.0) (2020-06-12)

### Features

- remove level boundary check ([8972d47](https://github.com/unjs/consola/commit/8972d478c93690fafb909f49d9d0edbcb67bddae))

### Bug Fixes

- **types:** fix silent/verbose levels ([7ab0a65](https://github.com/unjs/consola/commit/7ab0a65f383d9dd1b68a18ee439bf19468a57885))

### [2.12.2](https://github.com/unjs/consola/compare/v2.12.1...v2.12.2) (2020-05-26)

### Bug Fixes

- silent log level does not work ([#98](https://github.com/unjs/consola/issues/98)) ([6a4a79c](https://github.com/unjs/consola/commit/6a4a79c24b8db902b078ad92a6ee7a33880ed26c))

### [2.12.1](https://github.com/unjs/consola/compare/v2.12.0...v2.12.1) (2020-05-07)

### Bug Fixes

- new LogLevel enum is not exported properly [#95](https://github.com/unjs/consola/issues/95) ([#96](https://github.com/unjs/consola/issues/96)) ([fafbec2](https://github.com/unjs/consola/commit/fafbec2b1bc75912eea5d0618a27b982738d6cda))

## [2.12.0](https://github.com/unjs/consola/compare/v2.11.3...v2.12.0) (2020-05-07)

### Features

- **types:** add missing typescript definitions for reporters ([#94](https://github.com/unjs/consola/issues/94)) ([4a08ef0](https://github.com/unjs/consola/commit/4a08ef02bc48ddc887f2b91713520eda50793a27))

### [2.11.3](https://github.com/unjs/consola/compare/v2.11.2...v2.11.3) (2019-12-31)

### Bug Fixes

- **typescript:** remove cjs export (fixes [#88](https://github.com/unjs/consola/issues/88)) ([0d9ab1b](https://github.com/unjs/consola/commit/0d9ab1bba8645853c721069c57527764ed708869))

### [2.11.2](https://github.com/unjs/consola/compare/v2.11.1...v2.11.2) (2019-12-27)

### Bug Fixes

- **types:** `const consola = require('consola')` type is wrong ([#80](https://github.com/unjs/consola/issues/80)) ([5c22d8c](https://github.com/unjs/consola/commit/5c22d8cd4624e3bbd7294b9eba09f131ed786332))
- throttle expiration ([#81](https://github.com/unjs/consola/issues/81)) ([940474d](https://github.com/unjs/consola/commit/940474d3b64a4969acdec04290734e700920c19f)), closes [#68](https://github.com/unjs/consola/issues/68)

### [2.11.1](https://github.com/unjs/consola/compare/v2.11.0...v2.11.1) (2019-12-17)

### Bug Fixes

- **consola:** use `options.stderr` ([#77](https://github.com/unjs/consola/issues/77)) ([774c673](https://github.com/unjs/consola/commit/774c6739e794665bc5e2c40aa84921b7f2a26387))

## [2.11.0](https://github.com/unjs/consola/compare/v2.10.0...v2.11.0) (2019-11-10)

### Features

- **browser:** add support of formatted strings ([#66](https://github.com/unjs/consola/issues/66)) ([920f313](https://github.com/unjs/consola/commit/920f313dba322c34ccd1b2f08afba59122c3b8e7))

### Bug Fixes

- typecheck type and tag before normalize ([1984deb](https://github.com/unjs/consola/commit/1984deb0a5214a3aa82dab972ec76af20ba14d1b))
- **types:** reporter in remove methods are optional ([#70](https://github.com/unjs/consola/issues/70)) ([a17cdb1](https://github.com/unjs/consola/commit/a17cdb1a423e41076c58692130955d5a9f5e36ba))

### [2.10.1](https://github.com/unjs/consola/compare/v2.10.0...v2.10.1) (2019-08-05)

## [2.10.0](https://github.com/unjs/consola/compare/v2.9.0...v2.10.0) (2019-08-05)

### Bug Fixes

- add missing typescript declaration for level, stdout and stderr ([#58](https://github.com/unjs/consola/issues/58)) ([a149dbb](https://github.com/unjs/consola/commit/a149dbb))

### Features

- improve typescript type definitions ([#57](https://github.com/unjs/consola/issues/57)) ([80eefd8](https://github.com/unjs/consola/commit/80eefd8))

## [2.9.0](https://github.com/unjs/consola/compare/v2.8.0...v2.9.0) (2019-06-18)

### Features

- count spam log ([197a6b3](https://github.com/unjs/consola/commit/197a6b3))

## [2.8.0](https://github.com/unjs/consola/compare/v2.7.1...v2.8.0) (2019-06-18)

### Features

- spam preventation ([7da806b](https://github.com/unjs/consola/commit/7da806b))

### [2.7.1](https://github.com/unjs/consola/compare/v2.7.0...v2.7.1) (2019-05-26)

### Bug Fixes

- **browser:** hide `:` with tag and normal log ([8250d5a](https://github.com/unjs/consola/commit/8250d5a))

## [2.7.0](https://github.com/unjs/consola/compare/v2.6.2...v2.7.0) (2019-05-26)

### Bug Fixes

- correctly calculate line width when using grave accent ([bad52bd](https://github.com/unjs/consola/commit/bad52bd))

### Features

- always hide right side on width < 80 ([07d8246](https://github.com/unjs/consola/commit/07d8246))
- improve basic logs ([ea6ce59](https://github.com/unjs/consola/commit/ea6ce59))
- **browser:** fancier logs ([b64f337](https://github.com/unjs/consola/commit/b64f337))
- hide time from basic logger as it is commonly used in CI environments ([68c3bae](https://github.com/unjs/consola/commit/68c3bae))
- smart hide time and tag when there is no space ([00a375f](https://github.com/unjs/consola/commit/00a375f))

### [2.6.2](https://github.com/unjs/consola/compare/v2.6.1...v2.6.2) (2019-05-15)

### Bug Fixes

- transpile browser dist to ES5 ([1f81eea](https://github.com/unjs/consola/commit/1f81eea)), closes [unjs/unjs.js#5743](https://github.com/unjs/consola/issues/5743)

### [2.6.1](https://github.com/unjs/consola/compare/v2.6.0...v2.6.1) (2019-05-08)

### Bug Fixes

- **browser:** use `console.warn` when possible ([#49](https://github.com/unjs/consola/issues/49)) ([e386ede](https://github.com/unjs/consola/commit/e386ede))

# [2.6.0](https://github.com/unjs/consola/compare/v2.5.8...v2.6.0) (2019-04-12)

### Features

- expose constructor and reporters ([3a8f662](https://github.com/unjs/consola/commit/3a8f662))

## [2.5.8](https://github.com/unjs/consola/compare/v2.5.7...v2.5.8) (2019-03-29)

### Bug Fixes

- **types:** allow passing extra arguments ([#46](https://github.com/unjs/consola/issues/46)) ([d29fc46](https://github.com/unjs/consola/commit/d29fc46))

## [2.5.7](https://github.com/unjs/consola/compare/v2.5.6...v2.5.7) (2019-03-19)

### Bug Fixes

- **formatting:** fix formatting when multiple back-quotes ([#44](https://github.com/unjs/consola/issues/44)) ([669a12e](https://github.com/unjs/consola/commit/669a12e))

## [2.5.6](https://github.com/unjs/consola/compare/v2.5.5...v2.5.6) (2019-02-25)

### Bug Fixes

- **ts:** revert export consola ts declarations ([#43](https://github.com/unjs/consola/issues/43)) ([6bd4f85](https://github.com/unjs/consola/commit/6bd4f85))

<a name="2.4.1"></a>

## [2.4.1](https://github.com/unjs/consola/compare/v2.4.0...v2.4.1) (2019-02-12)

### Bug Fixes

- **ts:** set type "any" ([#40](https://github.com/unjs/consola/issues/40)) ([ea9d551](https://github.com/unjs/consola/commit/ea9d551))

<a name="2.4.0"></a>

# [2.4.0](https://github.com/unjs/consola/compare/v2.3.2...v2.4.0) (2019-02-05)

### Bug Fixes

- **esm:** fix esm compatibility ([8ddecc3](https://github.com/unjs/consola/commit/8ddecc3))
- **consola:** return `this` in setReporters ([544a887](https://github.com/unjs/consola/commit/544a887))
- **types:** set message type to "any" ([#39](https://github.com/unjs/consola/issues/39)) ([ff97b09](https://github.com/unjs/consola/commit/ff97b09)), closes [#38](https://github.com/unjs/consola/issues/38)

### Features

- **types:** update types ([d0d7455](https://github.com/unjs/consola/commit/d0d7455))

<a name="2.3.2"></a>

## [2.3.2](https://github.com/unjs/consola/compare/v2.3.1...v2.3.2) (2019-01-06)

### Bug Fixes

- **types:** add some of the missing types ([#35](https://github.com/unjs/consola/issues/35)) ([5e3e69b](https://github.com/unjs/consola/commit/5e3e69b))
- ignore winston dep in webpack ([#37](https://github.com/unjs/consola/issues/37)) ([e534a28](https://github.com/unjs/consola/commit/e534a28))

<a name="2.3.1"></a>

## [2.3.1](https://github.com/unjs/consola/compare/v2.3.0...v2.3.1) (2019-01-02)

### Bug Fixes

- bypass webpack for lazy required version of winston ([500b509](https://github.com/unjs/consola/commit/500b509))

<a name="2.3.0"></a>

# [2.3.0](https://github.com/unjs/consola/compare/v2.2.6...v2.3.0) (2018-11-19)

### Bug Fixes

- **isLogObj:** handle non-standard error objects ([8748c81](https://github.com/unjs/consola/commit/8748c81))

### Features

- browser reporter improvements ([591d0b4](https://github.com/unjs/consola/commit/591d0b4)), closes [#31](https://github.com/unjs/consola/issues/31)
- **fancy:** look like jest traces ([ecae238](https://github.com/unjs/consola/commit/ecae238))

<a name="2.2.6"></a>

## [2.2.6](https://github.com/unjs/consola/compare/v2.2.5...v2.2.6) (2018-11-14)

### Bug Fixes

- **json-reporter:** add a default value to the constructor ([#33](https://github.com/unjs/consola/issues/33)) ([c59db36](https://github.com/unjs/consola/commit/c59db36))

<a name="2.2.5"></a>

## [2.2.5](https://github.com/unjs/consola/compare/v2.2.4...v2.2.5) (2018-11-14)

### Bug Fixes

- expose typescript typings ([f0398ed](https://github.com/unjs/consola/commit/f0398ed))

<a name="2.2.4"></a>

## [2.2.4](https://github.com/unjs/consola/compare/v2.2.3...v2.2.4) (2018-11-08)

### Bug Fixes

- use basic reporter only for ci and test environments ([33220e4](https://github.com/unjs/consola/commit/33220e4))

<a name="2.2.3"></a>

## [2.2.3](https://github.com/unjs/consola/compare/v2.2.2...v2.2.3) (2018-11-07)

### Bug Fixes

- **fancy:** honor logObj.icon ([d56fa38](https://github.com/unjs/consola/commit/d56fa38))

<a name="2.2.2"></a>

## [2.2.2](https://github.com/unjs/consola/compare/v2.2.1...v2.2.2) (2018-11-04)

### Bug Fixes

- update std-env to 2.1.1 ([32a9c67](https://github.com/unjs/consola/commit/32a9c67))

<a name="2.2.1"></a>

## [2.2.1](https://github.com/unjs/consola/compare/v2.2.0...v2.2.1) (2018-11-04)

### Bug Fixes

- remove file:// from error stack traces ([ff24b69](https://github.com/unjs/consola/commit/ff24b69))

<a name="2.2.0"></a>

# [2.2.0](https://github.com/unjs/consola/compare/v2.1.1...v2.2.0) (2018-11-04)

### Bug Fixes

- correctly handle falsy values ([367fb19](https://github.com/unjs/consola/commit/367fb19))

### Features

- support formatOptions. resolves [#29](https://github.com/unjs/consola/issues/29). ([7ed640f](https://github.com/unjs/consola/commit/7ed640f))

<a name="2.1.1"></a>

## [2.1.1](https://github.com/unjs/consola/compare/v2.1.0...v2.1.1) (2018-11-03)

### Bug Fixes

- add legacy ready and start levels for more backward compatibility ([f54b5c2](https://github.com/unjs/consola/commit/f54b5c2))

<a name="2.1.0"></a>

# [2.1.0](https://github.com/unjs/consola/compare/v2.0.9...v2.1.0) (2018-11-03)

### Features

- add aliases ([cbea7bd](https://github.com/unjs/consola/commit/cbea7bd))
- mockTypes for easy mocking ([a332890](https://github.com/unjs/consola/commit/a332890))

<a name="2.0.9"></a>

## [2.0.9](https://github.com/unjs/consola/compare/v2.0.8...v2.0.9) (2018-11-03)

<a name="2.0.8"></a>

## [2.0.8](https://github.com/unjs/consola/compare/v2.0.7...v2.0.8) (2018-11-03)

<a name="2.0.7"></a>

## [2.0.7](https://github.com/unjs/consola/compare/v2.0.6...v2.0.7) (2018-11-02)

### Bug Fixes

- always use computed values for stdout/stderr ([f91abc0](https://github.com/unjs/consola/commit/f91abc0))

<a name="2.0.6"></a>

## [2.0.6](https://github.com/unjs/consola/compare/v2.0.5...v2.0.6) (2018-11-02)

<a name="2.0.5"></a>

## [2.0.5](https://github.com/unjs/consola/compare/v2.0.4...v2.0.5) (2018-11-02)

<a name="2.0.4"></a>

## [2.0.4](https://github.com/unjs/consola/compare/v2.0.3...v2.0.4) (2018-11-02)

### Bug Fixes

- **fancy:** remove extra icons ([b66fde0](https://github.com/unjs/consola/commit/b66fde0))

<a name="2.0.3"></a>

## [2.0.3](https://github.com/unjs/consola/compare/v2.0.2...v2.0.3) (2018-11-02)

### Bug Fixes

- **pkg:** exclude src from package ([4b1fb7d](https://github.com/unjs/consola/commit/4b1fb7d))
- use live console.\_stdout bindings for default stream ([d9573c3](https://github.com/unjs/consola/commit/d9573c3))

<a name="2.0.2"></a>

## [2.0.2](https://github.com/unjs/consola/compare/v2.0.1...v2.0.2) (2018-11-02)

### Bug Fixes

- **error:** always strip first line from stack ([3afa9aa](https://github.com/unjs/consola/commit/3afa9aa))

<a name="2.0.1"></a>

## [2.0.1](https://github.com/unjs/consola/compare/v2.0.0...v2.0.1) (2018-11-02)

### Bug Fixes

- **fancy:** use proper color for log paths ([7c75283](https://github.com/unjs/consola/commit/7c75283))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/unjs/consola/compare/v2.0.0-2...v2.0.0) (2018-11-02)

<a name="2.0.0-2"></a>

# [2.0.0-2](https://github.com/unjs/consola/compare/v2.0.0-1...v2.0.0-2) (2018-11-02)

### Bug Fixes

- add methods for legacy support ([4bdd034](https://github.com/unjs/consola/commit/4bdd034))
- preserve additional new lines ([340a001](https://github.com/unjs/consola/commit/340a001))
- update std-env to 2.1.0 ([2dc2a50](https://github.com/unjs/consola/commit/2dc2a50))

### Features

- support badge with fancy ([38600fe](https://github.com/unjs/consola/commit/38600fe))

<a name="2.0.0-1"></a>

# [2.0.0-1](https://github.com/unjs/consola/compare/v2.0.0-0...v2.0.0-1) (2018-10-31)

<a name="2.0.0-0"></a>

# [2.0.0-0](https://github.com/unjs/consola/compare/v1.4.4...v2.0.0-0) (2018-10-31)

### Bug Fixes

- add schmance.js ([2929648](https://github.com/unjs/consola/commit/2929648))
- **docs:** update readme ([#22](https://github.com/unjs/consola/issues/22)) ([e75f2a0](https://github.com/unjs/consola/commit/e75f2a0))
- add default/undefined color for browser ([39584d2](https://github.com/unjs/consola/commit/39584d2))
- add missing parseStack import ([da53dee](https://github.com/unjs/consola/commit/da53dee))
- also copy symbols in assignGlobalReference ([b0eefb5](https://github.com/unjs/consola/commit/b0eefb5))
- don't return this when calling log functions ([f07e056](https://github.com/unjs/consola/commit/f07e056))
- fix badge display ([e036eed](https://github.com/unjs/consola/commit/e036eed))
- fix main field ([4b56e48](https://github.com/unjs/consola/commit/4b56e48))
- fix typos ([45e2f99](https://github.com/unjs/consola/commit/45e2f99))
- handle null value of obj for assignToLogObj ([d2402af](https://github.com/unjs/consola/commit/d2402af))
- improve browser packaging ([4d8c8d0](https://github.com/unjs/consola/commit/4d8c8d0))
- lint ([f909761](https://github.com/unjs/consola/commit/f909761))
- lint ([d976620](https://github.com/unjs/consola/commit/d976620))
- only one color ending parameter is enough ([d213634](https://github.com/unjs/consola/commit/d213634))
- readme: icon string length is digit ([31f1894](https://github.com/unjs/consola/commit/31f1894))
- remove name assignment ([8d59075](https://github.com/unjs/consola/commit/8d59075))
- remove pushes for better readability ([418d84a](https://github.com/unjs/consola/commit/418d84a))
- rename private fields ([244fe5c](https://github.com/unjs/consola/commit/244fe5c))
- rename require test file ([cfc8f9e](https://github.com/unjs/consola/commit/cfc8f9e))
- return earlier on not displaying levels ([cfdcf04](https://github.com/unjs/consola/commit/cfdcf04))
- support Error as logObject ([134ff54](https://github.com/unjs/consola/commit/134ff54))
- text color comment ([9336fbc](https://github.com/unjs/consola/commit/9336fbc))
- update demo ([3842e0e](https://github.com/unjs/consola/commit/3842e0e))
- use symbols for private property access ([8e6343c](https://github.com/unjs/consola/commit/8e6343c))

### Code Refactoring

- additionalStyle ~> additionalColor ([3f808e9](https://github.com/unjs/consola/commit/3f808e9))

### Features

- add **VERSION** to consola prototype ([982c8ca](https://github.com/unjs/consola/commit/982c8ca))
- add assignGlobalConsola helper ([1af28f7](https://github.com/unjs/consola/commit/1af28f7))
- add getter/setter for level ([7af5ed5](https://github.com/unjs/consola/commit/7af5ed5))
- add global.consola ([4da784d](https://github.com/unjs/consola/commit/4da784d))
- add shmancy reporter ([dc6121a](https://github.com/unjs/consola/commit/dc6121a))
- add symbols to browser ([30cd4f0](https://github.com/unjs/consola/commit/30cd4f0))
- add sync/async write ([8525525](https://github.com/unjs/consola/commit/8525525))
- add typescript typings ([#24](https://github.com/unjs/consola/issues/24)) ([0853a6f](https://github.com/unjs/consola/commit/0853a6f))
- align basic and fancy reporter tags ([38a4729](https://github.com/unjs/consola/commit/38a4729))
- better stack formater ([f5acb3c](https://github.com/unjs/consola/commit/f5acb3c))
- detect version changes and throw a warning ([73bdd1a](https://github.com/unjs/consola/commit/73bdd1a))
- improve packaging and exports ([90da862](https://github.com/unjs/consola/commit/90da862))
- improve packaging for browser support ([47af1df](https://github.com/unjs/consola/commit/47af1df))
- initial works for v2.0.0 ([455b6f9](https://github.com/unjs/consola/commit/455b6f9))
- log formatting using printf ([2afb025](https://github.com/unjs/consola/commit/2afb025))
- no more side effects ([c015c31](https://github.com/unjs/consola/commit/c015c31))
- pause/resume ([f217cc1](https://github.com/unjs/consola/commit/f217cc1))
- return new consola instance with consola.create ([4ae3614](https://github.com/unjs/consola/commit/4ae3614))
- rework \_createLogFn with better argument handling ([2d4af39](https://github.com/unjs/consola/commit/2d4af39))
- scope inheritance support ([#23](https://github.com/unjs/consola/issues/23)) ([0070c54](https://github.com/unjs/consola/commit/0070c54))
- **fancy/basic:** support logObj.stack field ([aa2216f](https://github.com/unjs/consola/commit/aa2216f))
- setReporters, withDefaults and withTag ([912446f](https://github.com/unjs/consola/commit/912446f))
- showType option ([ed294e4](https://github.com/unjs/consola/commit/ed294e4))
- style browser reporter ([d39684d](https://github.com/unjs/consola/commit/d39684d))
- support all chalk colors ([2cec678](https://github.com/unjs/consola/commit/2cec678)), closes [#20](https://github.com/unjs/consola/issues/20)
- wrapConsole ([3962a1f](https://github.com/unjs/consola/commit/3962a1f))
- wrapStd ([f8bfbeb](https://github.com/unjs/consola/commit/f8bfbeb))
- write error and warns to process.stderr by default ([6565254](https://github.com/unjs/consola/commit/6565254))

### Performance Improvements

- **basic:** refactor getWriteMethod ([c52db69](https://github.com/unjs/consola/commit/c52db69))
- remove all DEPRECATED helpers for less bundle size ([fe39d37](https://github.com/unjs/consola/commit/fe39d37))

### BREAKING CHANGES

- Use new additionalColor prop
- lot's of internals had been changed.
- Behavior may be changed in some conditions

<a name="1.4.4"></a>

## [1.4.4](https://github.com/unjs/consola/compare/v1.4.3...v1.4.4) (2018-10-13)

### Bug Fixes

- add global.consola ([558cae5](https://github.com/unjs/consola/commit/558cae5))

<a name="1.4.3"></a>

## [1.4.3](https://github.com/unjs/consola/compare/v1.4.2...v1.4.3) (2018-08-18)

### Bug Fixes

- use more compatible string to clear the console ([82ce410](https://github.com/unjs/consola/commit/82ce410))

<a name="1.4.2"></a>

## [1.4.2](https://github.com/unjs/consola/compare/v1.4.1...v1.4.2) (2018-08-12)

### Bug Fixes

- cannot set level as 0 in options ([4c1ecce](https://github.com/unjs/consola/commit/4c1ecce))

<a name="1.4.1"></a>

## [1.4.1](https://github.com/unjs/consola/compare/v1.4.0...v1.4.1) (2018-05-27)

### Bug Fixes

- **fancy:** logObj.type ([418be28](https://github.com/unjs/consola/commit/418be28))

<a name="1.4.0"></a>

# [1.4.0](https://github.com/unjs/consola/compare/v1.3.0...v1.4.0) (2018-05-27)

### Features

- support custom additional style ([#18](https://github.com/unjs/consola/issues/18)) ([7a750bf](https://github.com/unjs/consola/commit/7a750bf))
- **fancy:** support icon field ([0123bed](https://github.com/unjs/consola/commit/0123bed))

<a name="1.3.0"></a>

# [1.3.0](https://github.com/unjs/consola/compare/v1.2.0...v1.3.0) (2018-04-15)

### Bug Fixes

- **reporters/fancy:** extra space for additional ([efeab44](https://github.com/unjs/consola/commit/efeab44))
- prevent duplicate consola instances when different versions used by packages ([0bce262](https://github.com/unjs/consola/commit/0bce262))

### Features

- support extra log arguments ([8b6d3d2](https://github.com/unjs/consola/commit/8b6d3d2))

<a name="1.2.0"></a>

# [1.2.0](https://github.com/unjs/consola/compare/v1.1.4...v1.2.0) (2018-04-02)

### Features

- **basic:** support additional field ([b50cad8](https://github.com/unjs/consola/commit/b50cad8))
- improve packaging ([158e8ef](https://github.com/unjs/consola/commit/158e8ef))

### Performance Improvements

- require needed lodash methods only ([91065e4](https://github.com/unjs/consola/commit/91065e4))

<a name="1.1.4"></a>

## [1.1.4](https://github.com/unjs/consola/compare/v1.1.3...v1.1.4) (2018-03-31)

### Bug Fixes

- **package:** add chalk to dependencies ([3f738e9](https://github.com/unjs/consola/commit/3f738e9))

<a name="1.1.3"></a>

## [1.1.3](https://github.com/unjs/consola/compare/v1.1.2...v1.1.3) (2018-03-31)

### Bug Fixes

- only include dist and src in package ([8b477ec](https://github.com/unjs/consola/commit/8b477ec))

<a name="1.1.2"></a>

## [1.1.2](https://github.com/unjs/consola/compare/v1.1.1...v1.1.2) (2018-03-31)

### Bug Fixes

- handle null and undefined calls ([1f98bb1](https://github.com/unjs/consola/commit/1f98bb1))

<a name="1.1.1"></a>

## [1.1.1](https://github.com/unjs/consola/compare/v1.1.0...v1.1.1) (2018-03-31)

### Bug Fixes

- add prepublish script ([8dd8700](https://github.com/unjs/consola/commit/8dd8700))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/unjs/consola/compare/v1.0.0...v1.1.0) (2018-03-31)

### Features

- rewrite FancyReporter without ora ([73c1ddc](https://github.com/unjs/consola/commit/73c1ddc))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/unjs/consola/compare/v0.1.0...v1.0.0) (2018-03-31)

<a name="0.1.0"></a>

# 0.1.0 (2018-03-31)

### Features

- add log type for console compability ([96a8162](https://github.com/unjs/consola/commit/96a8162))
