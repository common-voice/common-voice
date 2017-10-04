import { h, Component } from 'preact';

export default (props: any) => {
  const imgSrc = props.reverse
    ? '/img/cv-logo-one-color-white.svg'
    : '/img/cv-logo-bw.svg';

  return (
    <a
      class="main-logo"
      href="/"
      onClick={evt => {
        evt.preventDefault();
        evt.stopPropagation();
        props.navigate('/');
      }}>
      <img class="main-mozilla-logo" src={imgSrc} />
    </a>
  );
};
