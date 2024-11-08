## REVIEW

sc-review-lang-not-selected = Você não selecionou nenhum idioma. Vá em seu <profileLink>Perfil</profileLink> para selecionar idiomas.
sc-review-title = Revisar frases
sc-review-loading = Carregando frases…
sc-review-select-language = Selecione um idioma para revisar frases.
sc-review-no-sentences = Nenhuma frase para revisar. <addLink>Adicione mais frases agora!</addLink>
sc-review-form-prompt =
    .message = Frases revisadas não foram enviadas, tem certeza?
sc-review-form-usage = Deslize para direita para aprovar a frase. Deslize para esquerda para rejeitar. Deslize para cima para pular. <strong>Não esqueça de enviar sua revisão!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Origem: { $sentenceSource }
sc-review-form-button-reject = Rejeitar
sc-review-form-button-skip = Pular
sc-review-form-button-approve = Aprovar
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Você também pode usar atalhos de teclado: { sc-review-form-button-approve-shortcut } para aprovar, { sc-review-form-button-reject-shortcut } para rejeitar, { sc-review-form-button-skip-shortcut } para pular
sc-review-form-button-submit =
    .submitText = Concluir revisão
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nenhuma frase revisada.
        [one] 1 frase revisada. Obrigado!
       *[other] { $sentences } frases revisadas. Obrigado!
    }
sc-review-form-review-failure = A revisão não pôde ser salva. Tente novamente mais tarde.
sc-review-link = Revisão

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Critérios de revisão
sc-criteria-title = Critérios de revisão
sc-criteria-make-sure = Assegure que a frase atende aos seguintes critérios:
sc-criteria-item-1 = A frase deve ser escrita corretamente.
sc-criteria-item-2 = A frase deve estar gramaticalmente correta.
sc-criteria-item-3 = Deve ser possível pronunciar a frase.
sc-criteria-item-4 = Se a frase atender aos critérios, clique no botão &quot;Aprovar&quot; à direita.
sc-criteria-item-5-2 = Se a frase não atender aos critérios acima, clique no botão &quot;Rejeitar&quot; à esquerda. Se não tiver certeza sobre a frase, você também pode pular e passar para a próxima.
sc-criteria-item-6 = Se você não tiver mais frases para revisar, ajude-nos a coletar mais frases!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Verificou <icon></icon> se é uma frase linguisticamente correta?
sc-review-rules-title = A frase atende às diretrizes?
sc-review-empty-state = No momento, não há frases a revisar neste idioma.
report-sc-different-language = Outro idioma
report-sc-different-language-detail = Está escrito em um idioma diferente do que estou revisando.
sentences-fetch-error = Ocorreu um erro ao buscar frases
review-error = Ocorreu um erro ao revisar esta frase
review-error-rate-limit-exceeded = Você está indo rápido demais. Dedique um momento para revisar a frase e ter certeza de que está correta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Estamos a fazer grandes mudanças
sc-redirect-page-subtitle-1 = O coletor de frases está migrando para a plataforma principal do Common Voice. Agora você pode <writeURL>escrever</writeURL> uma frase ou <reviewURL>revisar</reviewURL> envios de uma única frase no Common Voice.
sc-redirect-page-subtitle-2 = Faça-nos perguntas no <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ou por <emailLink>email</emailLink>.
