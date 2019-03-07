import * as React from 'react';
import { LocaleLink } from '../locale-helpers';
import * as logo from '../../../img/cv-logo-one-color-white.svg';
import * as logoBw from '../../../img/cv-logo-bw.svg';

export default (props: { reverse?: boolean }) => {
  const imgSrc = props.reverse ? logo : logoBw;

  return (
    <LocaleLink className="main-logo" to="">
      <img className="main-mozilla-logo" src={imgSrc} />
    </LocaleLink>
  );
};
