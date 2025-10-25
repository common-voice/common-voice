---
name: Add accents or variants
about: Add accents or variants to a language on Common Voice
title: 'Accents/Variants request: '
type: task
assignees: 'bandrandr'
---

## Language you're requesting for

<!-- Please provide the language name and ISO-693 code -->

## Type of request

- [ ] Accent
- [ ] Variant (e.g. dialect)

## Necessary data

### Accents
For every accent, please provide: 
- The accent name (in English)
- The accent name (in the language itself) 

E.g.
Kinmen County - 出生地：金門縣
Lienchiang County - 出生地：連江縣

[Example](https://github.com/common-voice/common-voice/pull/4789#pullrequestreview-2660129767)

### Variants

For every variant, please provide: 
- The variant name (in English)
- The variant name (in the language itself) 
- A language-subtag entity: from the IANA [BCP-47](https://datatracker.ietf.org/doc/html/rfc5646) [subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) (look for `Type: variant`) - where possible, the Variant should use the available subtags. 
	NOTE: You may wish to submit a request to  IANA for new subtags for your variant, but that is not necesssary to start

	If a subtag is not available, then it should be given in the format language-variant or language-region, e.g. en-AU or vi-hanoi. The variant part must be at least 5 characters, the region part should be 2 characters long (see [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)). The subtag should follow BCP-47 syntax guidelines, for example the order of language tokens. 
- Short description of the variant.

E.g.
Hanoi - Hà Nội - vi-hanoi
Hue - Huế - vi-hue
Saigon - Sài Gòn - vi-saigon


[Example](https://github.com/common-voice/common-voice/issues/5087#issuecomment-3389064729)

