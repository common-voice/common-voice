## REVIEW

sc-review-lang-not-selected = mɩ̀tɩ̀lɩ̀sɩ́ kʊ̀nʊ́m nákɩ̀ɖɩ̀.
sc-review-title = ɩ̀bɛ́m tɔ́m píyà
sc-review-loading = Tɔ́m pɩ́yà
sc-review-select-language = ɩ̀lɩ́zɩ̀ kʊ̀nʊ̀ʊ́́ nɩ́ ɩ̀bɛ̀m tɔ́m píyà
sc-review-no-sentences = Tɔ́m pìɖé nádɩ̀yɛ̀ fɛ̀yɩ́ se pɛ̀bɛ̀m. Mɩ̀mbɩ̀z<addLink> ɩ̀tàsɩ̀ tɔ́m píyà pɩ̀ɖɔɔ́</addLink>
sc-review-form-prompt =
    .message = tɔ́m píyà wèntɩ̀ pɛ̃́mpɛ̀m ná sɩ̀tɩ̀ɖɛ́tà, mɩ́ŋjàtɩ́ sé ɩ̀tàsɩ̀ ɛ̀lá yáwè
sc-review-form-usage = ìdúzìnà núúnì kìdìyùú ɖɔ̀ pìwìlí sìsè pɩ́là. ìdúzìnà núúnì nɩ̀bɩ̀yʊ́ ɖɔ̀ pìwìlí sìsè pɩ̀dàlà.  ìdúzìnà ɩ́zɔ́dá ɩ̀zɔ́nà. <strong> ɩ́gɩ̀zɔ́nà mɩ́dɛ́ yègìí mɩ́bázɩ̀ pɛ́m nà wàlɩ́ ŋ́ŋ̀ɛ̀nɛ̀ !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = líɖɩ̀ :{ $sentenceSource }
sc-review-form-button-reject = kɩ̀sɩ̀tɩ́
sc-review-form-button-skip = tɛ́ɖɩ̀
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Mɩ́mbɩ̀zɩ́  ɛ̀lànɩ́ klávíé wéŋkɩ̀ kɩ̀ŋlàm ʈàzàm nà : { sc-review-form-button-approve-shortcut } nɩ̀ pɩ̀pɩ̀zɩ́ pɩ̀tɩ́zɩ̀, { sc-review-form-button-reject-shortcut } nɩ̀ pɩ̀pɩ̀zɩ́ pɩ̀kɩ́zɩ̀, { sc-review-form-button-skip-shortcut } nɩ̀ pɩ̀pɩ̀zɩ́ pɩ̀tɛ́
sc-review-form-button-submit =
    .submitText = ɩ̀tɛ̀zɩ̀ wɩ́lɩ́tɩ̀
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [1] Tɔ́m wéntɩ̀ pɩ̀mbɛ̃́ŋ ná. kòŋkarɩ́ !
        [0] Pàtàtámbɛ̃́ŋ tɔ́m nàkɩ́ɖɛ́ tàá.
        [one] { $sentences }tɔ́m píyà wéntɩ̀ pɩ̀mbɩ́ŋ ná. kòŋkarɩ́
       *[other] Pàtàdámbɛ̃́ŋ tɔ́m píyà nàzɩ́ɖɛ́ tàá.
    }
sc-review-form-review-failure = pɛ̀ḿ tàbɩ́zɩ̀ pʊ́gbɔ́ɔ́. á pɩ́dázɩ̀ ɩ̀bázɩ̀
sc-review-link = kpɛ̀lɛ́kɩ̀tɩ́

## REVIEW CRITERIA

sc-criteria-modal = wémbì páɖʊ̀ sɩ̀sè pálà kpɛ̀lɛ̀m tá nɩ̀
sc-criteria-title = wémbì páɖʊ̀ sɩ̀sè pálà kpɛ̀lɛ̀m tá nɩ̀
sc-criteria-make-sure = ɩ́ɖézɩ̀ sìsè tɔ́m tɩ̀nà kìfóó wèmbí pàzɩ́ sɩ̀nɛ̀
sc-criteria-item-1 = Tɔ́m tɩ̀ná tɩ̀tɛ́ɛ́ tɔ́m píyà mɔ́nà pàmá xɛ̀ kàzá
sc-criteria-item-2 = Tɔ́m pɔ̀ʊ́ɖɛ̀ mɔ́nà pʊ́fó ŋ̀ŋɛ́nɩ̀ kʊ̀nʊ́m wánnʊ̀m nɛ̀
sc-criteria-item-3 = Pɩ̀pɔ́zɩ̀ pàmbɩ̀zɩ́ pàkàlá tɔ́m pàmátɩ̀ nɛ̀
sc-criteria-item-4 = á tɔ́m pɔ́ɖɛ̀ tɛ́ mádɩ̀ fó màɖà ɩ̀bɛ́m nùnì kìɖìyù nɖɔ́, tóŋkà nàkàɖá wɛ̀ pàmá sìsé <<ɛ̀ñʊ́ʊ́>> ɛ̀gɔ́dɩ́ kɔ̀ɖɔ̀zɩ̀
sc-criteria-item-5-2 = á tɔ́m pɔ́ɖɛ̀ tɛ̀ máɖɩ́ tùfúmmàɖà á pɩ̀lɛ̀ tóŋgà nàkàɖà wɛ̀ pàmá sìsé ɛ́-<<kɩ̀zɩ̀>> ɛ̀gɔ́dɩ́ kɛ̀lɛ̀ kɔ̀ɖɔ́zɩ̀ kɛ̀wɛ̀nà núnì nɩ̀bɩ̀yʊ́ . á ŋgʊ́ mílám sɩ́gà, ɩ̀fɛ̀lɛ̀ pɩ̀káá íbò tɔ́m pɔ́ɖɛ̀ pɩ́zàndá tɛ̀ pɩ̀ɖɔ́zɩ̀
sc-criteria-item-6 = á mʊ́gʊ̀ɖɩ̀ mɩ́fɛ̀yɩ̀nà tɔ́m pɔ̀wà sɩ̀ ɩ̀bɛ́m á pɩ́lɛ̀ ɛ̀zɩ̀náɖáá ʈɩ́jáá tɔ́m pɔ̀wà kɩ̀fàlà.
report-sc-different-language = kʊ̀nʊ́m nàkɩ̀ɖɩ̀
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Táŋlám wéntɩ̀ fèfèɖé ntɩ̀
# menu item
review-sentences = ɩ̀bɛ̀m tɔ́m píyà tá
