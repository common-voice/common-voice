1. General information
======================

Common Voice is a corpus of speech data read by users on the Common Voice website (https://voice.mozilla.org/), and based upon text from a number of public domain sources like user submitted blog posts, old books, movies, and other public speech corpora. Its primary purpose is to enable the training and testing of automatic speech recognition (ASR) systems, but we encourage its use for other purposes as well.


2. Structure
============

The corpus is split into several parts for your convenience. The subsets with “valid” in their name are audio clips that have had at least 2 people listen to them, and the majority of those listeners say the audio matches the text. The subsets with “invalid” in their name are clips that have had at least 2 listeners, and the majority say the audio does *not* match the clip. All other clips, ie. those with fewer than 2 votes, or those that have equal valid and invalid votes, have “other” in their name.

The “valid” and “other” subsets are further divided into 3 groups:
* dev - for development and experimentation
* train - for use in speech recognition training
* test - for testing word error rate


2.1 Organization and Conventions
--------------------------------

Each subset of data has a corresponding csv file with the following naming convention:

“cv-{type}-{group}.csv”

Here “type” can be one of {valid, invalid, other}, and “group” can be one of {dev, train, test}. Note, the invalid set is not divided into groups.

Each row of a csv file represents a single audio clip, and contains the following information:
* filename - relative path of the audio file
* text - supposed transcription of the audio
* up_votes - number of people who said audio matches the text
* down_votes - number of people who said audio does not match text
* age - age of the speaker, if the speaker reported it
  teens: '< 19'
  twenties: '19 - 29'
  thirties: '30 - 39'
  fourties: '40 - 49'
  fifties: '50 - 59'
  sixties: '60 - 69'
  seventies: '70 - 79'
  eighties: '80 - 89'
  nineties: '> 89'
* gender - gender of the speaker, if the speaker reported it
  male
  female
  other
* accent - accent of the speaker, if the speaker reported it
  us: 'United States English'                                                                                                                                          
  australia: 'Australian English'
  england: 'England English'
  canada: 'Canadian English'
  philippines: 'Filipino'
  hongkong: 'Hong Kong English'
  indian: 'India and South Asia (India, Pakistan, Sri Lanka)'
  ireland: 'Irish English'
  malaysia: 'Malaysian English'
  newzealand: 'New Zealand English'
  scotland: 'Scottish English'
  singapore: 'Singaporean English'
  southatlandtic: 'South Atlantic (Falkland Islands, Saint Helena)'
  african: 'Southern African (South Africa, Zimbabwe, Namibia)'
  wales: 'Welsh English'
  bermuda: 'West Indies and Bermuda (Bahamas, Bermuda, Jamaica, Trinidad)'



The audio clips for each subset are stored as mp3 files in folders with the same naming conventions as it’s corresponding csv file. So, for instance, all audio data from the valid train set will be kept in the folder “cv-valid-train” alongside the “cv-valid-train.csv” metadata file.


Acknowledgments
===============

We sincerely  thank all of the people who donated their voice on the Common Voice website and app. You are the backbone of this project, and we thank you for making this possible!

We also thank our community on Discourse (https://discourse.mozilla-community.org/c/voice) and Github (https://github.com/mozilla/voice-web), you have made this project better every step of the way.

And special thanks to Mycroft, SNIPS.ai, Mythic, Tatoeba.org, Bangor University, and SAP for joining us on this journey. We look forward to working more with each of you.

---
Michael Henretty, Tilman Kamp, Kelly Davis & The Common Voice Team
Mozilla
Nov. 29, 2017
