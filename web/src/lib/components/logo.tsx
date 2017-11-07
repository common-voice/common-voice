import * as React from 'react';

export default (props: any) => {
  const imgSrc = props.reverse
    ? '/img/cv-logo-one-color-white.svg'
    : '/img/cv-logo-bw.svg';

  return (
    <a
      className="main-logo"
      href="/"
      onClick={evt => {
        evt.preventDefault();
        evt.stopPropagation();
        props.navigate('/');
      }}>
      <img className="main-mozilla-logo" src={imgSrc} />
    </a>
  );
};
