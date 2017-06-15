import { h, Component } from 'preact';

export default (props) => {
  return <a class="main-logo" href="/"
    onClick={(evt) =>  {
      evt.preventDefault();
      evt.stopPropagation();
      props.navigate('/');
    }}>
    <span class="main-title">Common Voice</span><br />
    <img class="main-mozilla-logo" src="/img/mozilla.svg" />
  </a>;
}
