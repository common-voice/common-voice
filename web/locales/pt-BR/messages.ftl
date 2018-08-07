## General

yes-receive-emails = Sim, envie-me e-mails. Eu gostaria de ficar informado sobre o Projeto Common Voice.
stayintouch = Nós da Mozilla estamos construindo uma comunidade ao redor da tecnologia de voz. Nós gostaríamos de manter contato com atualizações, novas fontes de dados e ouvir mais sobre como você está usando esses dados.
privacy-info = Nós prometemos cuidar das suas informações com cautela. Leia mais em nosso <privacyLink>Aviso de Privacidade</privacyLink>.
return-to-cv = Voltar para o Common Voice
email-input =
    .label = E-mail
submit-form-action = Enviar
loading = Carregando…

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

an = Aragonês
ar = Árabe
as = Assamês
ast = Asturiano
az = Azerbaidjano
bn = Bengalês
br = Bretão
bxr = Buriato
ca = Catalão
cak = Caqchiquel
cnh = Hakha Chin
cs = Tcheco
cv = Tchuvache
cy = Galês
da = Dinamarquês
de = Alemão
dsb = Baixo Sorábio
el = Grego
en = Inglês
eo = Esperanto
es = Espanhol
et = Estoniano
fi = Finlandês
fo = Feroês
fr = Francês
fy-NL = Frisão
ga-IE = Irlandês
he = Hebraico
hsb = Alto Sorábio
hu = Húngaro
ia = Interlíngua
id = Indonésio
is = Islandês
it = Italiano
ja = Japonês
ka = Georgiano
kab = Kabyle
kk = Cazaque
ko = Coreano
kpv = Komi-Zyrian
kw = Córnico
ky = Quirguiz
mk = Macedônio
myv = Erzya
nb-NO = Norueguês (Bokmål)
ne-NP = Nepalês
nl = Holandês
nn-NO = Novo norueguês
or = Odia
pl = Polonês
pt-BR = Português (Brasil)
rm = Romanche
ro = Romeno
ru = Russo
sah = Sakha
sk = Eslovaco
sl = Esloveno
sq = Albanês
sr = Sérvio
sv-SE = Sueco
ta = Tâmil
te = Telugo
th = Tailandês
tr = Turco
tt = Tártaro
uk = Ucraniano
ur = Urdu
uz = Usbeque
zh-CN = Chinês (China)
zh-HK = Chinês (Hong Kong)
zh-TW = Chinês (Taiwan)

# [/]


## Layout

speak = Falar
speak-now = Fale agora
datasets = Conjuntos de dados
languages = Idiomas
profile = Perfil
help = Ajuda
contact = Contato
privacy = Privacidade
terms = Termos
cookies = Cookies
faq = Perguntas frequentes
content-license-text = Conteúdo disponível sob licença <licenseLink>Creative Commons</licenseLink>
share-title = Ajude-nos a encontrar outros doadores de voz!
share-text = Ajude a ensinar às máquinas como uma pessoal fala, doando sua voz em { $link }
link-copied = Link copiado
back-top = Voltar para o início
contribution-banner-text = Lançamos uma nova experiência para contribuição
contribution-banner-button = Dê uma olhada
report-bugs-link = Ajude reportando problemas

## Home Page

home-title = O projeto Common Voice é uma iniciativa da Mozilla para ensinar as máquinas como pessoas reais falam.
home-cta = Doe sua voz, contribua aqui!
wall-of-text-start = A voz é natural, a voz é humana. É por isso que estamos fascinados com a criação de uma tecnologia de voz utilizável para nossas máquinas. Mas para criar sistemas de voz, é necessária uma quantidade extremamente grande de dados de voz.
wall-of-text-more-mobile = A maior parte dos dados utilizados por grandes empresas não estão disponíveis para a maioria das pessoas. Nós achamos que isso sufoca a inovação. Então lançamos o Projeto Common Voice, para ajudar a tornar o reconhecimento de voz aberto para todos.
wall-of-text-more-desktop = Agora você pode doar sua voz para nos ajudar a construir um banco de voz aberto que qualquer pessoa pode utilizar para criar aplicativos inovadores para dispositivos e a web.<lineBreak></lineBreak> Leia uma frase para ajudar as máquinas aprenderem como pessoas reais falam. Avalie o trabalho de outros contribuidores para melhorar a qualidade. É assim simples!
show-wall-of-text = Saiba mais
help-us-title = Ajude-nos a validar as frases!
help-us-explain = Aperte o play, ouça e diga-nos: Eles pronunciaram a frase abaixo corretamente?
no-clips-to-validate = Parece que não há nenhuma frase para ouvir nesse idioma. Ajude-nos a preencher essa espaço gravando algo agora.
vote-yes = Sim
vote-no = Não
toggle-play-tooltip = Pressione { shortcut-play-toggle } para alternar para o modo de reprodução

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

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

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Gravar/Parar
request-language-text = Seu idioma ainda não está disponível no Common Voice?
request-language-button = Solicite um idioma

## ProjectStatus

status-title = Status geral do projeto: veja o nosso progresso!
status-contribute = Contribua com sua voz
status-hours =
    { $hours ->
        [one] Uma hora válida até agora!
       *[other] { $hours } horas válidas até agora!
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Próximo objetivo: { $goal }
english = Inglês

## ProfileForm

profile-form-cancel = Sair do formulário
profile-form-delete = Excluir perfil
profile-form-username =
    .label = Usuário
profile-form-language =
    .label = Idioma
profile-form-accent =
    .label = Sotaque
profile-form-age =
    .label = Idade
profile-form-gender =
    .label = Gênero
profile-form-submit-save = Salvar
profile-form-submit-saved = Salvo
profile-keep-data = Manter dados
profile-delete-data = Excluir dados
male = Masculino
female = Feminino
# Gender
other = Outro
why-profile-title = Por que um perfil?
why-profile-text = Ao fornecer algumas informações sobre você, os dados de áudio que você enviou ao Common Voice serão mais úteis aos mecanismos de reconhecimento de fala que usamos para aprimorar sua precisão.
edit-profile = Editar perfil
profile-create = Criar um perfil
profile-create-success = Perfil criado com sucesso!
profile-close = Fechar
profile-clear-modal = Limpar seus dados de perfil significa que esta informação demográfica não será mais enviada ao Common Voice com suas gravações.
profile-explanation = Acompanhe o seu progresso com um perfil e ajude que as gravações sejam cada vez mais precisas.

## FAQ

faq-title = Perguntas frequentes
faq-what-q = O que é o Common Voice?
faq-what-a = A tecnologia de reconhecimento de voz pode revolucionar a forma como interagimos com as máquinas, mas os sistemas atualmente disponíveis são caros e proprietários. O Common Voice é um projeto para tornar a tecnologia de reconhecimento de voz facilmente acessível a todos. As pessoas doam suas vozes para um banco de dados maciço que permitirá que qualquer pessoa treine rapidamente e facilmente os aplicativos habilitados por voz. Todos os dados de voz estarão disponíveis para os desenvolvedores.
faq-important-q = Por que é importante?
faq-important-a = A voz é natural, a voz é humana. É a forma mais fácil e mais natural de se comunicar. Queremos que os desenvolvedores possam construir coisas incríveis de tradutores em tempo real até assistentes administrativos habilitados por voz. Mas ainda não há dados disponíveis publicamente para criar esses tipos de aplicativos. Esperamos que o Common Voice dê aos desenvolvedores o que precisam para inovar.
faq-get-q = Quem pode obter os dados do Common Voice?
faq-get-a = O conjunto de dados está disponível agora na nossa <downloadLink>página de download</downloadLink> sob a licença <licenseLink>CC-0</licenseLink>.
faq-mission-q = Por que o Common Voice é parte da missão da Mozilla?
faq-mission-a = A Mozilla dedica-se a manter a Web aberta e acessível para todos. Para fazer isso, precisamos capacitar os criadores da Web através de projetos como o Common Voice. À medida que as tecnologias de voz proliferam além de aplicações de nicho, acreditamos que eles devem atender todos os usuários igualmente bem. Vemos a necessidade de incluir mais idiomas, sotaques e dados demográficos ao criar e testar tecnologias de voz. A Mozilla quer ver uma Internet saudável e vibrante. Isso significa dar aos desenvolvedores acesso à dados de voz para que eles possam construir projetos novos e extraordinários. O Common Voice será um recurso público que ajudará às equipes da Mozilla e desenvolvedores ao redor do mundo.
faq-native-q = Eu não sou um falante nativo de { $lang } e falo com sotaque, vocês ainda querem minha voz?
faq-native-a = Sim, nós definitivamente queremos sua voz! Parte do objetivo do Common Voice é reunir tantos sotaques quanto for possível, assim os computadores poderão entender melhor a <bold>todos</bold> quando eles falarem.
faq-firefox-q = A conversão de voz para texto, através do Common Voice, se tornará parte do Firefox?
faq-firefox-a = O Common Voice tem um potencial ilimitado e estamos de fato explorando interfaces de fala em vários produtos da Mozilla, incluindo o Firefox.
faq-quality-q = Qual será o nível necessário de qualidade do áudio para que possa ser utilizado?
faq-quality-a = Queremos que a qualidade do áudio corresponda com a qualidade que um mecanismo de conversão de voz para texto verá no dia a dia. Isso ensinará ao mecanismo de voz para texto lidar com diferentes situações—conversas no fundo, barulhos de carro e ruídos em geral—sem erros.
faq-hours-q = Por que o objetivo é capturar 10,000 horas de áudio?
faq-hours-a = Esse é o número aproximado de horas necessário para treinar um sistema de voz-para-texto.
faq-source-q = De onde vem o texto fonte?
faq-source-a1 = As frases atualmente vêm de doações de contribuidores, assim como diálogos de roteiros de filmes em domínio público como <italic>It’s a Wonderful Life.</italic>
faq-source-a2 = Você pode ver nossas frases <dataLink>nessa pasta no GItHub</dataLink>. 

## Profile

profile-why-title = Por que um perfil?
profile-why-content = Ao fornecer algumas informações sobre você, os dados de áudio que enviar ao Common Voice serão úteis ao mecanismo de Reconhecimento de Fala que usa esses dados para melhorar a precisão.

## NotFound

notfound-title = Não encontrado
notfound-content = Eu tenho receio de não saber o que vocês estão procurando.

## Data

data-download-button = Baixar os dados do Common Voice
data-download-yes = Sim
data-download-deny = Não
data-download-license = Licença: <licenseLink>CC-0</licenseLink>
data-download-modal = Você está preste a iniciar um download de <size>{ $size }GB</size>, deseja continuar?
data-subtitle = Nós estamos construindo um conjunto de dados de voz aberto e publicamente disponível para que qualquer um possa usar no treinamento de suas aplicações de voz-ativa.
data-explanatory-text = Acreditamos que conjuntos de dados de voz grandes e acessíveis ao público promovem a inovação e a saudável concorrência comercial na aprendizagem de máquina baseada em voz. Este é um esforço global e convidamos todos a participar. O nosso objetivo é ajudar a tecnologia de voz a ser mais inclusivo, refletindo a diversidade das vozes ao redor do mundo.
data-get-started = <speechBlogLink>Comece com o reconhecimento de voz</speechBlogLink>
data-other-title = Outro conjunto de dados de voz...
data-other-goto = Vá para { $name }
data-other-download = Baixar dados
data-other-librispeech-description = O LibriSpeech é um corpus de aproximadamente 1000 horas (em 16 Khz) de leitura em inglês derivada de audiolivros do projeto LibriVox.
data-other-ted-name = TED-LIUM Corpus
data-other-ted-description = O TED-LIUM corpus foi criado a partir dos áudio das palestras e suas transcrições que estão disponíveis na página do TED.
data-other-voxforge-description = VoxForge foi configurado para coletar falas transcritas para serem usadas com motores de reconhecimento de fala gratuito e de código aberto.
data-other-tatoeba-description = Tatoeba é uma grande base de dados de frases, traduções e áudio para uso em aprendizagem de idioma. Este arquivo contém todas as falas em inglês gravadas por sua comunidade.
data-bundle-button = Baixar pacote do conjunto de dados
data-bundle-description = Os dados do Common Voice mais todos os outros conjuntos de dados acima.
license = Licença: <licenseLink>{ $license }</licenseLink>
license-mixed = Misto

## Record Page

record-platform-not-supported = Nos desculpe, mas sua plataforma não é suportada.
record-platform-not-supported-desktop = Em computadores, você pode baixar o mais recente:
record-platform-not-supported-ios = Usuários de <bold>iOS</bold> podem baixar nosso aplicativo gratuito:
record-must-allow-microphone = Você deve permitir o acesso ao microfone.
record-retry = Tentar novamente
record-no-mic-found = Não foi encontrado nenhum microfone.
record-error-too-short = A gravação foi muito curta.
record-error-too-long = A gravação foi muito longa
record-error-too-quiet = A gravação ficou com volume muito baixa.
record-submit-success = Enviada com sucesso! Deseja gravar novamente?
record-help = Toque para gravar, depois leias as frases em voz alta.
record-cancel = Cancelar regravação
review-terms = Usando o Common Voice, você aceita nossos <termsLink>Termos</termsLink> e <privacyLink>Política de Privacidade</privacyLink>
terms-agree = Estou de acordo
terms-disagree = Não estou de acordo
review-aborted = Envio abortado. Deseja excluir suas gravações?
review-submit-title = Revise e envie
review-submit-msg = Obrigado pela sua gravação!<lineBreak></lineBreak>Agora revise e envie-as abaixo.
review-recording = Revisar
review-rerecord = Regravar
review-cancel = Cancelar envio
review-keep-recordings = Manter as gravações
review-delete-recordings = Excluir minhas gravações

## Download Modal

download-title = Seu download começou.
download-helpus = Ajude-nos a construir uma comunidade ao redor da tecnologia de voz, mantenha contato por e-mail.
download-form-email =
    .label = Digite seu e-mail
    .value = Obrigado, nós entraremos em contato.
download-back = Voltar ao conjunto de dados do Common Voice
download-no = Não, obrigado

## Contact Modal

contact-title = Formulário de contato
contact-form-name =
    .label = Nome
contact-form-message =
    .label = Mensagem
contact-required = *necessário

## Request Language Modal

request-language-title = Solicitação de idioma
request-language-form-language =
    .label = Idioma
request-language-success-title = A solicitação de idioma foi enviada com sucesso, obrigado.
request-language-success-content = Nós entraremos em contato com mais informações sobre como adicionar o seu idioma ao Common Voice muito em breve.

## Languages Overview

language-section-in-progress = Em andamento
language-section-in-progress-description = O idioma "em curso" estão em desenvolvimento através de contribuições das nossas comunidades; o seu progresso reflete onde estão em relação a localização do site e coleta de frases.
language-section-launched = Iniciada
language-section-launched-description = Para os idiomas lançados o site foi completamente localizado, e tem frases suficientes para permitir contribuição através da <italic>{ speak }</italic> e <italic>{ listen }</italic> .
languages-show-more = Veja mais
languages-show-less = Ver menos
language-speakers = Falantes
language-meter-in-progress = Progresso
language-total-progress = Total
language-search-input =
    .placeholder = Pesquisar
language-speakers = Falantes
localized = Localizado
sentences = Frases
total-hours = Total de horas

## New Contribution

action-click = Clique
action-tap = Toque
contribute = Contribua
listen = Ouvir
skip = Pular
shortcuts = Atalhos
clips = Frases
goal-help-recording = Você ajudou o Common Voice a atingir <goalPercentage></goalPercentage> da nossa meta diária de { $goalValue } de gravações!
goal-help-validation = Você ajudou o Common Voice a atingir <goalPercentage></goalPercentage> da nossa meta diária de { $goalValue } de validações!
contribute-more = Pronto para fazer mais { $count }?
record-cta = Iniciar gravação
record-instruction = { $actionType }<recordIcon></recordIcon>e então leia a sentença em voz alta
record-stop-instruction = { $actionType } <stopIcon></stopIcon> quando terminar
record-three-more-instruction = No três, vai!
record-again-instruction = Ótimo! <recordIcon></recordIcon> Grave a próxima frase
record-again-instruction2 = Continue assim, grave novamente <recordIcon></recordIcon>
record-last-instruction = <recordIcon></recordIcon> Última!
review-tooltip = Revise e grave as frases enquanto prossegue
unable-speak = Incapaz de falar agora
review-instruction = Enquanto revisa, grave as frases novamente se precisar
record-submit-tooltip = { $actionType } enviar quando estiver pronto
clips-uploaded = Gravações carregadas
record-abort-title = Terminar a gravação primeiro?
record-abort-text = Se parar agora vai perder todo o seu progresso
record-abort-submit = Enviar frases
record-abort-continue = Finalizar gravação
record-abort-delete = Sair e excluir frases
listen-instruction = { $actionType } <playIcon></playIcon> as sentenças foram pronunciadas com precisão?
listen-again-instruction = Bom trabalho! <playIcon></playIcon> Ouça novamente quando estiver pronto
listen-3rd-time-instruction = 2 prontas <playIcon></playIcon> , continue assim!
listen-last-time-instruction = <playIcon></playIcon> Última!
nothing-to-validate = Não temos nada para validar neste idioma, ajude-nos a preencher a fila.
record-button-label = Grave sua voz
share-title-new = <bold>Ajude-nos</bold> a encontrar mais vozes
