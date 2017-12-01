import * as React from 'react';
import { Link } from 'react-router-dom';

export default (props: any) => {
  const imgSrc = props.reverse
    ? '/img/cv-logo-one-color-white.svg'
    : '/img/cv-logo-bw.svg';

  return (
    <Link className="main-logo" to="/">
      <img className="main-mozilla-logo" src={imgSrc} />
    </Link>
  );
};
