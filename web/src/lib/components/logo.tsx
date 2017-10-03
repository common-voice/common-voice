import { h, Component } from 'preact';

export default (props: any) => {
  return (
    <a
      class="main-logo"
      href="/"
      onClick={evt => {
        evt.preventDefault();
        evt.stopPropagation();
        props.navigate('/');
      }}>
      <img class="main-mozilla-logo" src="/img/cv-logo-bw.svg" />
    </a>
  );
};
