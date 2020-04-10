# Shared types and utilities

**See "Important notes" below for advice and warnings on how to use this module.**

Code for the Common Voice website is divided into separate `/web` and `/server` directories. `/common` is a separate module for shared types and code.

If you need to share code between `/web` and `/server`, put it here. We do not support direct imports from `/web` to `/server` or vice versa.

## Code organization

TypeScript code is currently separated into themed files, which are then bundled into a single `index.ts` file by [`create-ts-index`](https://github.com/imjuni/create-ts-index) and built into the `./js` directory.

This is an awkward setup – see the notes below. Eventually, we would like to go back to supporting `import { ChallengeTeams } from '@common/challenge'` syntax. See [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) for ideas.

## Important notes

- Code in this folder _cannot have side-effects,_ as this would mess up our tree-shaking.
- Files should not have default exports. All exports should be named.
- Generic export names should be avoided. Our index file is generated automatically, and flattens exports from each of the files. This means we can't have name conflicts, even between files.
