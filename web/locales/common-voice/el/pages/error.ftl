## Error pages

banner-error-slow-1 = Δυστυχώς, το Common Voice καθυστερεί. Ευχαριστούμε για το ενδιαφέρον σας.
banner-error-slow-2 = Παρατηρούμε πολλή επισκεψιμότητα και διερευνούμε τα ζητήματα αυτήν τη στιγμή.
banner-error-slow-link = Σελίδα κατάστασης
error-something-went-wrong = Δυστυχώς, κάτι πήγε στραβά
error-clip-upload = Η μεταφόρτωση του αποσπάσματος εξακολουθεί να αποτυγχάνει, θέλετε να συνεχιστεί η προσπάθεια;
error-clip-upload-server = Η μεταφόρτωση αυτού του αποσπάσματος εξακολουθεί να αποτυγχάνει στον διακομιστή. Ανανεώστε τη σελίδα ή δοκιμάστε ξανά αργότερα.
error-clip-upload-too-large = Το αρχείο ηχογράφησής σας είναι πολύ μεγάλο για μεταφόρτωση. Δοκιμάστε να ηχογραφήσετε ένα μικρότερο απόσπασμα.
error-clip-upload-server-error = Σφάλμα διακομιστή κατά την επεξεργασία του αποσπάσματός σας. Ανανεώστε τη σελίδα ή δοκιμάστε ξανά αργότερα.
error-title-404 = Δεν ήταν δυνατή η εύρεση αυτής της σελίδας
error-content-404 = Ίσως σας βοηθήσει η <homepageLink>αρχική μας σελίδα</homepageLink>; Για να θέσετε μια ερώτηση, γίνετε μέλος της <matrixLink>συνομιλίας της κοινότητας Matrix</matrixLink>, παρακολουθήστε τα ζητήματα της σελίδας μέσω του <githubLink>GitHub</githubLink> ή επισκεφτείτε το <discourseLink>φόρουμ στο Discourse</discourseLink>.
error-title-500 = Δυστυχώς, κάτι πήγε στραβά
error-content-500 = Προέκυψε απρόσμενο σφάλμα. Δοκιμάστε ξανά αργότερα. Για βοήθεια, γίνετε μέλος της <matrixLink>συνομιλίας της κοινότητας στο Matrix</matrixLink>, παρακολουθήστε τα ζητήματα του ιστοτόπου μέσω του <githubLink>GitHub</githubLink> ή επισκεφθείτε το <discourseLink>φόρουμ στο Discourse</discourseLink>.
error-title-502 = Η σύνδεση διακόπηκε
error-content-502 = Δεν είναι δυνατή η δημιουργία σταθερής σύνδεσης με τους διακομιστές μας αυτήν τη στιγμή. Δοκιμάστε ξανά αργότερα. Για βοήθεια, γίνετε μέλος της <matrixLink>συνομιλίας της κοινότητας στο Matrix</matrixLink>, παρακολουθήστε τα ζητήματα του ιστοτόπου μέσω του <githubLink>GitHub</githubLink> ή επισκεφθείτε το <discourseLink>φόρουμ στο Discourse</discourseLink>.
error-title-503 = Αντιμετωπίζουμε μη αναμενόμενο χρόνο διακοπής λειτουργίας
error-content-503 = Ο ιστότοπος θα επανέλθει το συντομότερο δυνατό. Για τις πιο πρόσφατες πληροφορίες, γίνετε μέλος της <matrixLink>κοινότητάς μας στο Matrix</matrixLink> ή επισκεφτείτε το <githubLink>GitHub</githubLink> ή το <discourseLink>φόρουμ μας στο Discourse</discourseLink> για να υποβάλετε και να παρακολουθήσετε ζητήματα σχετικά με τον ιστότοπο.
error-title-504 = Το χρονικό όριο αιτήματος έληξε
error-content-504 = Η διεκπεραίωση του αιτήματος διήρκησε πολλή ώρα. Αυτό είναι συνήθως προσωρινό. Δοκιμάστε ξανά. Για βοήθεια, γίνετε μέλος της <matrixLink>συνομιλίας της κοινότητας στο Matrix</matrixLink>, παρακολουθήστε τα ζητήματα του ιστοτόπου μέσω του <githubLink>GitHub</githubLink> ή επισκεφθείτε το <discourseLink>φόρουμ στο Discourse</discourseLink>.
error-code = Σφάλμα { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Δεν ήταν δυνατή η μεταφόρτωση του αποσπάσματός σας. Έχει ήδη μεταφορτωθεί στο παρελθόν. Ας συνεχίσουμε με την επόμενη δέσμη!
       *[other] Δεν ήταν δυνατή η μεταφόρτωση { $total } αποσπασμάτων. Έχουν ήδη μεταφορτωθεί στο παρελθόν. Ας συνεχίσουμε με την επόμενη δέσμη!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Μεταφορτώθηκαν { $total } από τα αποσπάσματά σας. Τα υπόλοιπα έχουν ήδη μεταφορτωθεί. Ας συνεχίσουμε με την επόμενη δέσμη!
