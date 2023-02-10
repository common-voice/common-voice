# How to add a new language validation

1. Copy the `en.ts` file in the `languages` folder and name it according to the new language
2. Adjust the content of the file to represent the new requirements for this specific language
3. Feel free to add comments to better explain what each validation does - if the error message can't be phrased descriptive enough
4. In `validation.ts` add a new import (as example for German - de):

```TypeScript
import de from './languages/de'
```

5. Expose the new require in the `VALIDATORS` object

```TypeScript
const VALIDATORS: Validators = {
  en,
  de,
}
```

## Invalidation rules structure

Each validation rule file exposes an array of invalidation rules. For each of those items the validator will either run the function `fn` or check the regex `regex`. If the function `fn` returns `true` or the `regex` matches the sentence, the sentence is considered invalid. For any invalid sentence the user will see the error message from the `error` property. Note that only the first found invalidation will be reported. If both `fn` and `regex` are specified, `regex` takes precendence.

### Simplified example

The following is a simplified example. You can run any regex checks that are deemed useful for the language you create a validation for.

```TypeScript
const INVALIDATIONS = [{
  type: 'fn',
  fn: (sentence) => {
    return sentence.length < 2 || words.length > 100;
  },
  error: `Number of words must be between 2 and 100 characters (inclusive)`,
},
{
  type: 'regex',
  regex: /[0-9]+/,
  error: 'Sentence contains numbers',
}]

export default INVALIDATIONS
```

In this example we are defining one function and one regex:

* Using a function: the first validation uses a function. While this example could be checked with a regex as well, this shows how more complicated validation could be done. See also the English validation file where we extract number of words. If the sentence contains less than 2 characters or more than 100, we return `true` and therefore the sentence will be marked as invalid. The user will see `Number of words must be between 2 and 100 characters (inclusive)` in the frontend. If the function returns `false` the sentence is valid.
* Using a regex: the second validation uses a regex. If the sentence contains any numbers, the regex matches and we will mark the sentence as invalid. The user will see `Sentence contains numbers` in the frontend. If no numbers are found (the regex doesn't match), the sentence will be marked as valid.

You can return the same error message for multiple invalidation rules if appropriate, however try to be as specific as possible. In the frontend the errors will be grouped by this error message.

## Normalization

For certain languages there are benefits of normalizing the sentence in NFC before running through validation. This can be enabled by adding the language code to the `USE_NFC_NORMALIZATION` array in `index.js`. Activating normalization means that any further steps will get the normalized sentence. This includes the validation rules, as well as saving it to the database and then later on exporting it to the Common Voice repository.

**Example:** In Korean you can either type `"ᄏ", "ᅩ" and "ᆯ"` which results in `콜` of length 3 (when checked with `.length`), or `콜` which is one code point.

If we apply NFC the validation process gets easier to define. This topic came up in [this PR](https://github.com/common-voice/sentence-collector/pull/630#issuecomment-1201099593).
