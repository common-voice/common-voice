import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  reverse?: boolean;
  to: string;
}

export default (props: Props) => {
  const imgSrc = props.reverse
    ? '/img/cv-logo-one-color-white.svg'
    : '/img/cv-logo-bw.svg';

  return (
    <Link className="main-logo" to={props.to}>
      <img className="main-mozilla-logo" src={imgSrc} />
    </Link>
  );
};
