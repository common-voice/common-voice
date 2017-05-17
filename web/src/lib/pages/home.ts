import Page from './page';
import User from '../user';

const PAGE_NAME = 'home'

export default class HomePage extends Page<void> {
  name: string = PAGE_NAME;

  constructor(user: User) {
    super(user, PAGE_NAME, true); // Don't need a nav item since we have logo.
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.content.innerHTML = `
<h2>Mozilla's Common Voice</h2>
<p>Build the world's most diverse set of voice data that researchers
and others can use for free to create better voice technologies for
the Internet.</p>

<p>Interested in helping out? It only takes a minute and doesn't
cost you a dime!</p>
<button id="donate">Donate now!</button>

<p>Your voice donations will be made available for researchers and
others to use under a
<a href="https://creativecommons.org/publicdomain/zero/1.0/">
Creative Commons license</a>. Your name or any other identifying
information will not be associated with this voice data.</p>

<p>This project is governed by
<a href="https://mozilla.org/privacy/websites/">
      Mozilla's Privacy Policy</a></p>`;

    let donate = this.content.querySelector('#donate');
    let tab = document.getElementById('record') as HTMLAnchorElement;
    donate.addEventListener('click',
      this.trigger.bind(this, 'nav', tab.href));
  }
}
