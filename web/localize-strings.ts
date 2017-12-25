import LocalizedStrings from 'react-localization';

let STRINGS = new LocalizedStrings({
  mk: {
    projectName: 'Jargon',
    companyName: 'Netcetera',
    back: 'Назад',
    required: '*задолжително',
    submit: 'Поднеси',
    review: 'Прегледај',
    rerecord: 'Пресними',
    yes: 'Да',
    no: 'Не',
    terms: 'Услови',
    privacy: 'Приватност',
    privacyInfo: 'Известувања за приватност',
    faq: 'ЧПП',
    cookies: 'Колачиња',
    help: 'Помош',
    discussion: 'Дискусија',
    contact: 'Контакт',
    email: 'Е-маил',
    username: 'Корисничко име',
    name: 'Име',
    language: 'Јазик',
    accent: 'Акцент',
    age: 'Возраст',
    gender: 'Пол',
    message: 'Порака',
    save: 'Зачувај',
    saved: 'Зачувано',
    agree: 'Се согласувам',
    disagree: 'Не се согласувам',
    speak: 'Зборувај',
    profile: 'Профил',
    contentAvailable: 'Содржината е достапна под ',
    returnToCommonVoiceDatasets: 'Врати се назад кон податочните множества',
    notFound: 'Страницата не е пронајдена',
    notFoundExplain: 'Се плашам дека не знам што бараш.',
    enterEmail: 'Внесете е-маил',
    noThanks: 'Не, фала',
    langAllCapital: 'МАКЕДОНСКИ',
    pagesOpenInApp: 'Отвори во апликација',
    pagesHelpFindDonator: 'Помогнете ни да најдеме донатори на глас!',
    shareMessage: 'На роботите им е потребна помош, донирајте го вашиот глас на ',
    homeTitle: 'Jargon ја носи вештачката интелигенција на македонски јазик',
    homeDonateVoice: 'Донирајте го вашиот глас!',
    homeDescriptionOne: 'Да се креира гласовна технологија за управување со машините е и\n' +
      'предизвик и наша пасија. Креирањето гласовни системи бара многу\n' +
      'податоци, но најголемиот дел од оние што ги кориситат големите\n' +
      'компании не се достапни за мнозинството. Сметаме дека тоа ја\n' +
      'попречува иновацијата и затоа со Mozzila го лансиравме проектот\n' +
      '"Common voice", којшто ќе помогне во препознавањето говор на\n' +
      'македонски јазик.',
    homeDescriptionTwo: 'Може да го донирате вашиот глас и да ни помогнете да изградиме отворена база' +
      'на податоци за да може секој да создаде иновативна апликација за' +
      'билокаков уред или вебстрана.',
    homeDescriptionThree: 'Прочитајте реченица за да им помогнете на компјутерите да научат\n' +
      'како луѓето зборуваат. Проверете ја работата на останатите и\n' +
      'подоберете го квалитетот. Толку е едноставно!',
    homeReadMore: 'Прочитај повеќе',
    homeHelpValidate: 'Помогнете да ги валидираме прочитаните реченици!',
    homeHelpExplain: 'Притисни play, слушни и кажи ни: дали долунаведената реченица е\n' +
      'точно прочитана?',
    validatorLoadingMsg: 'Се вчитува...',
    validatorLoadErrorMsg: 'Извинете! Ги процесираме нашите аудио снимки, Ве молиме пробајте подоцна.',
    contactModalHeader: 'Форма за контакт',
    projectStatusHeader: 'Целовкупен статус на проектот.',
    projectStatusValidateHours: ' валидирани часови текст до сега!',
    projectStatusNextGoal: 'Следна цел: ',
    projectStatusSoon: 'Дополнителни јазици наскоро!',
    profileActionsTitle: 'Зашто профил?',
    profileActionsContent: 'Со давање на информации за Вас, аудио податоците кои ги придонесувате за Common Voice ќе бидат покорисни ' +
      'за алатките за препознавање на говор, кои ги користат овие податоци за да ја подобрат нивната прецизност.',
    profileActionsSuccesMsg: 'Успешно е креиран профилот',
    profileActionsEditProfile: 'Уреди го профилот',
    profileActionsCreateProfile: 'Креирај профил',
    recordUnsupportedText: 'Се извинуваме, но вашата платформа моментално не е подржана.',
    recordDesktopDownload: 'На десктоп компјутер може да ја симнете последната верзија на',
    recordDownloadApp: 'корисниците може да ја симнат нашата бесплатна апликација:',
    recordAccessMic: 'Морате да дозволите пристап до микрофонот.',
    recordSuccessRec: 'Успешно поднесување! Дали сакате да се снимате повторно?',
    recordClickToRec: 'Ве молиме кликнете на крукчето за да започнете со снимање, а\n' +
      'потоа гласно прочитајте ја реченицата.',
    reviewTermsAgreements: 'Со користење на Common Voice, се согласувате со нашите ',
    reviewUploadCancel: 'Прикачувањето е откажано. Дали сакате да ги избришеме вашите снимки?',
    reviewSubmitHeader: 'Преглед и Поднесување',
    reviewReviewSubmitRow1: 'Ви благодариме за аудио снимките',
    reviewReviewSubmitRow2: 'Прегледајте и поднесете ги вашите снимки подолу.',
    reviewSubmitCancel: 'Прекини поднесување',
    reviewSaveAudio: 'Зачувај ги снимките',
    reviewDeleteAudio: 'Избриши ги снимките',
    faqFull: 'Често поставувани прашања',
    faqJargon: 'Што е Jargon?',
    faqJargonText: 'Технологијата базирана на препознавање глас, може да го револуционализира\n' +
      'начинот на кој ние комуницираме со машините, но во моментов сите постојни\n' +
      'системи се скапи и комерцијални. Jargon е проект кој има за цел овие\n' +
      'технологии да ги направи достапни за сите. Луѓето го донираат сопствениот\n' +
      'глас во масивна база на податоци, што ќе им овозможи на сите да дадат\n' +
      'придонес во апликации поврзани со гласовни команди, а сите гласовни\n' +
      'податоци ќе им бидат достапни на сите програмери.',
    faqWhyImportant: 'Зошто е важно?',
    faqWhyImportantText: 'Гласот е најлесниот и најприродниот начин на комуникација. Ние сакаме\n' +
      'програмерите да можат да креираат софтвер од вистински преведувачи и\n' +
      'административни асистенти базирани на глас. Но, во моментов нема доволен\n' +
      'број јавно достапни податоци со кои може да се креираат вакви апликации.\n' +
      'Jargon ќе им го даде она што им е потребно на програмерите за да можат да\n' +
      'иновираат.',
    faqLevelOfQuality: 'Кое е нивото на потребен квалитет за едно аудио да биде корисно?',
    faqLevelOfQualityText: 'Ние сакаме квалитетот на аудиото да одговара на квалитетот на она што ќе\n' +
      'го има во природни услови. Сакаме варијабилност. Тоа не учи како да се\n' +
      'справуваме со различни ситуации - позадински шум, бучава од возила, гласно\n' +
      'навивање - и сето тоа без грешки.',
    faqOurGoal: 'Зошто цел за снименото аудио се 10,000 часови?',
    faqOurGoalText: 'Тоа е приближниот број на часови потребни да се обучи еден STT систем.',
    faqSource: 'Кој е изворот на текстот?',
    faqSourceText: 'Во моментов речениците произлегуваат од донатори кои сакаат да придонесат,\n' +
      'како и од јавни домени од филмски сценарија како "Титаник".',
    faqSourceText2: 'Речениците може да ги прегледате во оваа датотека на ',
    profileFormModalText: 'Со бришење на податоците од вашиот профил, вашите демографски\n' +
      'информации нема повеќе да се испраќаат до Common Voice заедно со\n' +
      'вашите снимки.',
    profileFormExitForm: 'Изгаси ја формата',
    profileFormDeleteProfile: 'Избриши профил',
    profileFormAcceptMessages: 'Да, прифаќам да примам пораки со новости за Common Voice Project.',
    profileFormMoreLanguages: 'Повеќе јазици наскоро!',
    profileFormKeepData: 'Зачувај податоци',
    profileFormDeleteData: 'Избриши податоци',
    reviewSaveRecords: 'Зачувај ги снимките',
    emailModalHeader: 'Твоето симнување започна.',
    emailModalFormParagraphOne: 'Help us build a community around voice technology, stay in touch via\n' +
      'email.',
    emailModalFormParagraphTwo: 'We at Mozilla are building a community around voice technology. We\n' +
      'would like to stay in touch with updates, new data sources and to\n' +
      'hear more about how you are using this data.',
    emailModalFormParagraphThree: 'We promise to handle your information with care. Read more in our ',
    emailModalKeepInTouch: 'Ви благодариме, ќе бидеме во контакт.',
  },
  ch: {
    projectName: 'Jargon',
    companyName: 'Netcetera',
    back: 'Назад',
    required: '*задолжително',
    submit: 'Поднеси',
    review: 'Прегледај',
    rerecord: 'Пресними',
    yes: 'Да',
    no: 'Не',
    terms: 'Услови',
    privacy: 'Приватност',
    privacyInfo: 'Известувања за приватност',
    faq: 'ЧПП',
    cookies: 'Колачиња',
    help: 'Помош',
    discussion: 'Дискусија',
    contact: 'Контакт',
    email: 'Е-маил',
    username: 'Корисничко име',
    name: 'Име',
    language: 'Јазик',
    accent: 'Акцент',
    age: 'Возраст',
    gender: 'Пол',
    message: 'Порака',
    save: 'Зачувај',
    saved: 'Зачувано',
    agree: 'Се согласувам',
    disagree: 'Не се согласувам',
    speak: 'swiss',
    profile: 'swiss',
    contentAvailable: 'Содржината е достапна под ',
    returnToCommonVoiceDatasets: 'Врати се назад кон податочните множества',
    notFound: 'Страницата не е пронајдена',
    notFoundExplain: 'Се плашам дека не знам што бараш.',
    enterEmail: 'Внесете е-маил',
    noThanks: 'Не, фала',
    langAllCapital: 'МАКЕДОНСКИ',
    pagesOpenInApp: 'Отвори во апликација',
    pagesHelpFindDonator: 'Помогнете ни да најдеме донатори на глас!',
    shareMessage: 'На роботите им е потребна помош, донирајте го вашиот глас на ',
    homeTitle: 'Jargon ја носи вештачката интелигенција на македонски јазик',
    homeDonateVoice: 'Донирајте го вашиот глас!',
    homeDescriptionOne: 'Да се креира гласовна технологија за управување со машините е и\n' +
      'предизвик и наша пасија. Креирањето гласовни системи бара многу\n' +
      'податоци, но најголемиот дел од оние што ги кориситат големите\n' +
      'компании не се достапни за мнозинството. Сметаме дека тоа ја\n' +
      'попречува иновацијата и затоа со Mozzila го лансиравме проектот\n' +
      '"Common voice", којшто ќе помогне во препознавањето говор на\n' +
      'македонски јазик.',
    homeDescriptionTwo: 'Може да го донирате вашиот глас и да ни помогнете да изградиме отворена база' +
      'на податоци за да може секој да создаде иновативна апликација за' +
      'билокаков уред или вебстрана.',
    homeDescriptionThree: 'Прочитајте реченица за да им помогнете на компјутерите да научат\n' +
      'како луѓето зборуваат. Проверете ја работата на останатите и\n' +
      'подоберете го квалитетот. Толку е едноставно!',
    homeReadMore: 'Прочитај повеќе',
    homeHelpValidate: 'Помогнете да ги валидираме прочитаните реченици!',
    homeHelpExplain: 'Притисни play, слушни и кажи ни: дали долунаведената реченица е\n' +
      'точно прочитана?',
    validatorLoadingMsg: 'Се вчитува...',
    validatorLoadErrorMsg: 'Извинете! Ги процесираме нашите аудио снимки, Ве молиме пробајте подоцна.',
    contactModalHeader: 'Форма за контакт',
    projectStatusHeader: 'Целовкупен статус на проектот.',
    projectStatusValidateHours: ' валидирани часови текст до сега!',
    projectStatusNextGoal: 'Следна цел: ',
    projectStatusSoon: 'Дополнителни јазици наскоро!',
    profileActionsTitle: 'Зашто профил?',
    profileActionsContent: 'Со давање на информации за Вас, аудио податоците кои ги придонесувате за Common Voice ќе бидат покорисни ' +
      'за алатките за препознавање на говор, кои ги користат овие податоци за да ја подобрат нивната прецизност.',
    profileActionsSuccesMsg: 'Успешно е креиран профилот',
    profileActionsEditProfile: 'Уреди го профилот',
    profileActionsCreateProfile: 'Креирај профил',
    recordUnsupportedText: 'Се извинуваме, но вашата платформа моментално не е подржана.',
    recordDesktopDownload: 'На десктоп компјутер може да ја симнете последната верзија на',
    recordDownloadApp: 'корисниците може да ја симнат нашата бесплатна апликација:',
    recordAccessMic: 'Морате да дозволите пристап до микрофонот.',
    recordSuccessRec: 'Успешно поднесување! Дали сакате да се снимате повторно?',
    recordClickToRec: 'Ве молиме кликнете на крукчето за да започнете со снимање, а\n' +
      'потоа гласно прочитајте ја реченицата.',
    reviewTermsAgreements: 'Со користење на Common Voice, се согласувате со нашите ',
    reviewUploadCancel: 'Прикачувањето е откажано. Дали сакате да ги избришеме вашите снимки?',
    reviewSubmitHeader: 'Преглед и Поднесување',
    reviewReviewSubmitRow1: 'Ви благодариме за аудио снимките',
    reviewReviewSubmitRow2: 'Прегледајте и поднесете ги вашите снимки подолу.',
    reviewSubmitCancel: 'Прекини поднесување',
    reviewSaveAudio: 'Зачувај ги снимките',
    reviewDeleteAudio: 'Избриши ги снимките',
    faqFull: 'Често поставувани прашања',
    faqJargon: 'Што е Jargon?',
    faqJargonText: 'Технологијата базирана на препознавање глас, може да го револуционализира\n' +
      'начинот на кој ние комуницираме со машините, но во моментов сите постојни\n' +
      'системи се скапи и комерцијални. Jargon е проект кој има за цел овие\n' +
      'технологии да ги направи достапни за сите. Луѓето го донираат сопствениот\n' +
      'глас во масивна база на податоци, што ќе им овозможи на сите да дадат\n' +
      'придонес во апликации поврзани со гласовни команди, а сите гласовни\n' +
      'податоци ќе им бидат достапни на сите програмери.',
    faqWhyImportant: 'Зошто е важно?',
    faqWhyImportantText: 'Гласот е најлесниот и најприродниот начин на комуникација. Ние сакаме\n' +
      'програмерите да можат да креираат софтвер од вистински преведувачи и\n' +
      'административни асистенти базирани на глас. Но, во моментов нема доволен\n' +
      'број јавно достапни податоци со кои може да се креираат вакви апликации.\n' +
      'Jargon ќе им го даде она што им е потребно на програмерите за да можат да\n' +
      'иновираат.',
    faqLevelOfQuality: 'Кое е нивото на потребен квалитет за едно аудио да биде корисно?',
    faqLevelOfQualityText: 'Ние сакаме квалитетот на аудиото да одговара на квалитетот на она што ќе\n' +
      'го има во природни услови. Сакаме варијабилност. Тоа не учи како да се\n' +
      'справуваме со различни ситуации - позадински шум, бучава од возила, гласно\n' +
      'навивање - и сето тоа без грешки.',
    faqOurGoal: 'Зошто цел за снименото аудио се 10,000 часови?',
    faqOurGoalText: 'Тоа е приближниот број на часови потребни да се обучи еден STT систем.',
    faqSource: 'Кој е изворот на текстот?',
    faqSourceText: 'Во моментов речениците произлегуваат од донатори кои сакаат да придонесат,\n' +
      'како и од јавни домени од филмски сценарија како "Титаник".',
    faqSourceText2: 'Речениците може да ги прегледате во оваа датотека на ',
    profileFormModalText: 'Со бришење на податоците од вашиот профил, вашите демографски\n' +
      'информации нема повеќе да се испраќаат до Common Voice заедно со\n' +
      'вашите снимки.',
    profileFormExitForm: 'Изгаси ја формата',
    profileFormDeleteProfile: 'Избриши профил',
    profileFormAcceptMessages: 'Да, прифаќам да примам пораки со новости за Common Voice Project.',
    profileFormMoreLanguages: 'Повеќе јазици наскоро!',
    profileFormKeepData: 'Зачувај податоци',
    profileFormDeleteData: 'Избриши податоци',
    reviewSaveRecords: 'Зачувај ги снимките',
    emailModalHeader: 'Твоето симнување започна.',
    emailModalFormParagraphOne: 'Help us build a community around voice technology, stay in touch via\n' +
      'email.',
    emailModalFormParagraphTwo: 'We at Mozilla are building a community around voice technology. We\n' +
      'would like to stay in touch with updates, new data sources and to\n' +
      'hear more about how you are using this data.',
    emailModalFormParagraphThree: 'We promise to handle your information with care. Read more in our ',
    emailModalKeepInTouch: 'Ви благодариме, ќе бидеме во контакт.',
  },
});

export default STRINGS;