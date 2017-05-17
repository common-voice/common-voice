import Page from './page';
import User from '../user';

const PAGE_NAME = 'about';

export default class About extends Page<void> {
  name: string = PAGE_NAME;

  constructor(user: User) {
    super(user, PAGE_NAME);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = `About us.
</p>Project Common Voice is brought to you by Mozilla, the proudly non-profit champions of the Internet.</p>

<p>Today's technologies that allow learning from data are freely available for anyone to use, and are resulting a wave of innovation online. However, voice technologies (for example, speech recognition) are not seeing the same innovation because little data is freely available to train machine learning technologies. The data that is available is from a set of speakers with limited diversity of accents and languages.</p>

</p>Our aim with Project Common Voice is to enable "voice donors" to build the world's largest and most diverse set of voice data that is freely available for anyone to use. Our vision is that researchers and others will be able to use this data to increase innovation in voice related technologies. This will help everyone have access to a new wave of voice technologies, and ensure that people aren't locked-in to using services from a small number of Internet giants.</p>`;
  }
}
