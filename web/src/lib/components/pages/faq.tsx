import { h, Component } from 'preact';

interface Props {
  active: string;
}

interface State {
}

export default class FAQ extends Component<Props, State> {
  render() {
    return <div id="faq-container" className={this.props.active}>
      <h1>Frequently Asked Questions</h1>
      <h3>What is Common Voice?</h3>
      <p>Voice recognition technology could revolutionize the way we interact with machines, but it’s expensive and proprietary. Common Voice is a project to make voice recognition technology easily accessible to everyone. People donate their voices to a massive database that will let anyone quickly and easily train voice-enabled apps. All voice data will be available to developers.</p>

      <h3>Why is it important?</h3>
      <p>Voice is natural, voice is human. It’s the easiest and most natural way to communicate. With Common Voice, developers can build amazing things––from real-time translators to voice-enabled administrative assistants. But the data they need to build these apps isn’t publicly available. Common Voice will give them what they need to innovate.</p>

      <h3>When will the dataset be available?</h3>
      <p>Mozilla aims to begin to capture voices in June and release the open source database later in 2017.</p>
      <h3>Why is Common Voice part of the Mozilla mission?</h3>
      <p>Mozilla is dedicated to keeping the web open and accessible for everyone. To do it we need to empower web creators through projects like Common Voice. As voice technologies proliferate beyond niche applications, we believe they must serve all users equally well. We see a need to include more languages, accents and demographics when building and testing voice technologies. Mozilla wants to see a healthy, vibrant internet. That means giving new creators access to voice data so they can build new, extraordinary projects. Common Voice will be a public resource that will help Mozilla teams and developers around the world. </p>

      <h3>Will speech to text, via Common Voice, ever become part of Firefox?</h3>
      <p>Common Voice has unlimited potential and we would eventually integrate these engines into our Mozilla products as well—that means Firefox.</p>

      <h3>What is the level of quality needed for the audio in order to be used?</h3>
      <p>We want the audio quality to reflect the audio quality a speech-to-text engine will see in the wild. Thus, we want variety. This teaches the speech-to-text engine to handle various situations—background talking, car noise, fan noise—without errors.</p>

      <h3>Why is 10,000 hours the goal for capturing audio?</h3>
      <p>This is approximately the number of hours required to train a production STT system.</p>

      <h3>Where does the source text come from?</h3>
      <p>The current sentences come from contributor donations, as well as dialogue
         from public domain movie scripts like <i>It's a Wonderful Life.</i></p>
      <p>You can view our source sentences in <a target="_blank" href="https://github.com/mozilla/voice-web/blob/master/server/data/">this GitHub folder</a>.</p>
    </div>;
  }
}





