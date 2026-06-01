## Error pages

banner-error-slow-1 = Désolé, Common Voice fonctionne lentement. Merci de votre intérêt.
banner-error-slow-2 = Nous rencontrons une forte affluence et analysons les différents problèmes.
banner-error-slow-link = Page d’état
error-something-went-wrong = Désolé, une erreur s’est produite
error-clip-upload = L’envoi de ce clip échoue sans cesse. Voulez-vous réessayer ?
error-clip-upload-server = L’envoi de ce clip échoue toujours sur le serveur. Rechargez la page ou réessayez plus tard.
error-clip-upload-too-large = Le fichier de votre enregistrement est trop volumineux pour être envoyé. Veuillez enregistrer un échantillon plus court.
error-clip-upload-server-error = Erreur du serveur lors du traitement de votre échantillon. Veuillez actualiser la page ou réessayer plus tard.
error-title-404 = Page introuvable
error-content-404 = Peut-être que notre <homepageLink>page d’accueil</homepageLink> vous aidera ? Pour poser une question, rejoignez la <matrixLink>discussion communautaire Matrix</matrixLink>, surveillez les problèmes du site sur <githubLink>GitHub</githubLink> ou visitez nos <discourseLink>forums Discourse</discourseLink>.
error-title-500 = Désolé, une erreur s’est produite
error-content-500 = Une erreur inattendue s’est produite. Veuillez réessayer plus tard. Pour obtenir de l’aide, rejoignez la <matrixLink>discussion communautaire sur Matrix</matrixLink>, surveillez les problèmes du site via <githubLink>GitHub</githubLink> ou visitez <discourseLink>nos forums Discourse</discourseLink>.
error-title-502 = La connexion a été réinitialisée
error-content-502 = Vous n’arrivez pas à établir de connexion stable avec nos serveurs pour l’instant. Veuillez réessayer plus tard. Pour obtenir de l’aide, rejoignez la <matrixLink>discussion communautaire sur Matrix</matrixLink>, surveillez les problèmes du site via <githubLink>GitHub</githubLink> ou visitez <discourseLink>nos forums Discourse</discourseLink>.
error-title-503 = Nous subissons des temps d’arrêt inattendus
error-content-503 = L’accès au site sera restauré dans les plus brefs délais. Pour obtenir les dernières informations, rejoignez le <matrixLink>chat de la communauté Matrix</matrixLink>, visitez <githubLink>GitHub</githubLink> ou <discourseLink>nos forums Discourse</discourseLink> pour soumettre et surveiller les problèmes liés à l’utilisation du site.
error-title-504 = Temps de connexion dépassé
error-content-504 = La requête a mis trop de temps à aboutir. Ce problème est généralement temporaire. Veuillez réessayer. Pour obtenir de l’aide, rejoignez la <matrixLink>discussion communautaire sur Matrix</matrixLink>, surveillez les problèmes du site via <githubLink>GitHub</githubLink> ou visitez <discourseLink>nos forums Discourse</discourseLink>.
error-code = Erreur { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Impossible d’envoyer { $total } échantillon. Il a déjà été envoyé auparavant. Passons au lot suivant !
       *[other] Impossible d’envoyer { $total } échantillons. Ils ont déjà été envoyés auparavant. Passons au lot suivant !
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Nous avons envoyé { $uploaded } de vos échantillons. Les autres ont déjà été envoyés. Passons au lot suivant !
