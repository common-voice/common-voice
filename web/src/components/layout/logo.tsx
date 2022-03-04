import * as React from 'react';
import { LocaleLink } from '../locale-helpers';

const Logo = (props: { reverse?: boolean }) => {
  const imgSrc = props.reverse
    ? require('./cv-logo-one-color-white.svg')
    : require('./cv-logo-bw.svg');

  return (
    <LocaleLink className="main-logo" to="">
      <img
        className="main-mozilla-logo"
        src={imgSrc}
        alt="Mozilla Common Voice"
      />
    </LocaleLink>
  );
};

export default Logo;
