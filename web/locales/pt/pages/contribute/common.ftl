action-click = Clique em
action-tap = Toque
contribute = Contribua
review = Revisão
skip = Pular
shortcuts = Atalhos
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> clipe
       *[other] <bold>{ $count }</bold> clipes
    }
goal-help-recording = Você ajudou o Common Voice a atingir <goalPercentage></goalPercentage> da nossa meta diária de { $goalValue } de gravações!
goal-help-validation = Você ajudou o Common Voice a atingir <goalPercentage></goalPercentage> da nossa meta diária de { $goalValue } validações!
contribute-more = Pronto para fazer mais { $count }?
speak-empty-state = Nós ficamos sem frases para gravar neste idioma...
no-sentences-for-variants = Sua variante de idioma pode estar sem frases! Se você se sentir confortável, pode alterar suas configurações para ver outras frases no seu idioma.
speak-empty-state-cta = Contribua com frases
speak-loading-error =
    Não foi possível obter nenhuma frase para você falar.
    Tente novamente mais tarde.
record-button-label = Grave sua voz
share-title-new = <bold>Ajude-nos</bold> a encontrar mais vozes
keep-track-profile = Acompanhe seu progresso com um perfil
login-to-get-started = Entre ou cadastre-se para começar
target-segment-first-card = Você está contribuindo para nosso primeiro segmento alvo
target-segment-generic-card = Você está contribuindo para um segmento-alvo
target-segment-first-banner = Ajude a criar o primeiro segmento alvo do Common Voice em { $locale }
target-segment-add-voice = Adicione sua voz
target-segment-learn-more = Saiba mais
change-preferences = Alterar preferências

## Contribution Nav Items

contribute-voice-collection-nav-header = Coleta de voz
contribute-sentence-collection-nav-header = Coleta de frases

## Reporting

report = Relatar
report-title = Enviar um relato
report-ask = Que problemas você está experimentando com esta frase?
report-offensive-language = Linguagem ofensiva
report-offensive-language-detail = A frase é desrespeitosa ou usa linguagem ofensiva.
report-grammar-or-spelling = Erro gramatical ou ortográfico
report-grammar-or-spelling-detail = A frase tem um erro gramatical ou ortográfico.
report-different-language = Idioma diferente
report-different-language-detail = Ela é escrita em um idioma diferente do que estou falando.
report-difficult-pronounce = Dificuldade de pronúncia
report-difficult-pronounce-detail = Ela contém palavras ou trechos difíceis de ler ou pronunciar.
report-offensive-speech = Discurso ofensivo
report-offensive-speech-detail = O clipe tem linguagem desrespeitosa ou ofensiva.
report-other-comment =
    .placeholder = Comentário
success = Sucesso
continue = Continuar
report-success = O relato foi enviado com sucesso

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = g

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Gravar/Parar
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Regravar clipe
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Descartar gravação em andamento
shortcut-submit = Return
shortcut-submit-label = Enviar clipes
request-language-text = Seu idioma ainda não está disponível no Common Voice?
request-language-button = Solicite um idioma

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = r
shortcut-play-toggle-label = Tocar/Parar
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = s
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Critério
contribution-criteria-link = Entenda os critérios de contribuição
contribution-criteria-page-title = Critérios de contribuição
contribution-criteria-page-description = Saiba o que procurar ao ouvir clipes de voz e ajude a tornar suas gravações de voz mais ricas também!
contribution-for-example = por exemplo
contribution-misreadings-title = Erros de leitura
contribution-misreadings-description = Ao ouvir, verifique com muito cuidado se o que foi gravado é exatamente o que estava escrito; rejeite se houver o menor erro. <br />Erros muito comuns incluem:
contribution-misreadings-description-extended-list-1 = Falta de <strong>'Um'</strong> ou <strong>'O'</strong> no início da gravação.
contribution-misreadings-description-extended-list-2 = Falta de <strong>'s'</strong> no final de uma palavra.
contribution-misreadings-description-extended-list-3 = Leitura de contrações que não estão de fato no texto, como "d'água" em vez de "de água" ou vice-versa.
contribution-misreadings-description-extended-list-4 = Falta o final da última palavra devido à gravação ter sido encerrada rápido demais.
contribution-misreadings-description-extended-list-5 = Várias tentativas de ler uma palavra.
contribution-misreadings-example-1-title = Os dinossauros gigantes do Triássico.
contribution-misreadings-example-2-title = Os dinossauro gigantes do Triássico.
contribution-misreadings-example-2-explanation = [Deve ser ‘dinossauros’]
contribution-misreadings-example-3-title = Os dinossauros gigantes do Triássi-.
contribution-misreadings-example-3-explanation = [Gravação interrompida antes do final da última palavra]
contribution-misreadings-example-4-title = Os dinossauros gigantes do Triássico. Sim.
contribution-misreadings-example-4-explanation = [Foi gravado mais texto do que o necessário]
contribution-misreadings-example-5-title = Vamos sair para tomar café.
contribution-misreadings-example-6-title = Vou beber um copo d'água.
contribution-misreadings-example-6-explanation = [Deveria ser “de água”]
contribution-misreadings-example-7-title = Vamos sair para tomar um café.
contribution-misreadings-example-7-explanation = [Sem ‘um’ no texto original]
contribution-misreadings-example-8-title = A abelha passou rápido.
contribution-misreadings-example-8-explanation = [Conteúdo não corresponde]
contribution-varying-pronunciations-title = Pronúncias diferentes
contribution-varying-pronunciations-description = Seja cauteloso antes de rejeitar um clipe se considerar que o leitor pronunciou uma palavra incorretamente, colocou ênfase no lugar errado ou aparentemente ignorou um ponto de interrogação. Há uma grande variedade de pronúncias em uso no mundo todo, algumas das quais você pode não ter ouvido falar em sua comunidade local. Dê uma margem de apreço àqueles que podem falar de forma diferente de você.
contribution-varying-pronunciations-description-extended = Por outro lado, se julgar que o leitor provavelmente nunca se deparou com a palavra antes e está simplesmente dando um palpite incorreto na pronúncia, rejeite. Se não tiver certeza, use o botão de pular.
contribution-varying-pronunciations-example-1-title = O menino usava um chapéu.
contribution-varying-pronunciations-example-1-explanation = [Vogais átonas costumam ser pronunciadas no Brasil (menino, chapéu), mas não em Portugal (m'nino, ch'péu)]
contribution-varying-pronunciations-example-2-title = Su-a mão levantou.
contribution-varying-pronunciations-example-2-explanation = [‘Sua’ em português é sempre pronunciada como uma sílaba, não duas]
contribution-background-noise-title = Ruído de fundo
contribution-background-noise-description = Queremos que os algoritmos de aprendizado de máquina consigam lidar com uma variedade de ruídos de fundo. Mesmo ruídos relativamente altos podem ser aceitos, desde que não impeçam que você ouça o texto todo. Música de fundo tranquila está bem. Música alta o suficiente para atrapalhar a audição de pelo menos uma palavra, não.
contribution-background-noise-description-extended = Se a gravação falhar ou apresentar estalos, rejeite, a menos que o texto ainda possa ser ouvido na íntegra.
contribution-background-noise-example-1-fixed-title = <strong>[Espirro]</strong> Os dinossauros gigantes do <strong>[tosse]</strong> Triássico.
contribution-background-noise-example-2-fixed-title = O dinossauro gigante <strong>[tosse]</strong> do Triássico.
contribution-background-noise-example-2-explanation = [Parte do texto não pode ser ouvido]
contribution-background-noise-example-3-fixed-title = <strong>[Estalo]</strong> dinossauros gigantes do <strong>[estalo]</strong> -riássico.
contribution-background-voices-title = Vozes de fundo
contribution-background-voices-description = Um burburinho de fundo está bem, mas não queremos vozes adicionais que podem fazer com que um algoritmo de máquina identifique palavras que não estão no texto escrito. Se você conseguir ouvir palavras distintas das do texto, o clipe deve ser rejeitado. Normalmente, isso acontece quando a TV foi deixada ligada ou onde há uma conversa acontecendo por perto.
contribution-background-voices-description-extended = Se a gravação falhar ou apresentar estalos, rejeite, a menos que o texto ainda possa ser ouvido na íntegra.
contribution-background-voices-example-1-title = Os dinossauros gigantes do Triássico. <strong>[lido por uma voz]</strong>
contribution-background-voices-example-1-explanation = Você está vindo? <strong>[chamado por outra]</strong>
contribution-volume-title = Volume
contribution-volume-description = Há natural variação de volume entre os leitores. Rejeite somente se o volume estiver tão alto que a gravação falhe, ou (mais comum) se estiver tão baixo que você não possa ouvir o que está sendo dito sem referência ao texto escrito.
contribution-reader-effects-title = Efeitos do leitor
contribution-reader-effects-description = A maioria das gravações é de pessoas falando em sua voz natural. Você pode aceitar uma gravação ocasional fora do padrão que seja gritada, sussurrada ou obviamente feita com uma voz ‘dramática’. Rejeite gravações cantadas e aquelas que usam voz sintetizada por computador.
contribution-just-unsure-title = Não tem certeza?
contribution-just-unsure-description = Caso se depare com algo que essas diretrizes não abrangem, vote de acordo com seu bom senso. Se realmente não conseguir decidir, use o botão de pular e siga para a próxima gravação.
see-more = <chevron></chevron>Ver mais
see-less = <chevron></chevron>Ver menos
