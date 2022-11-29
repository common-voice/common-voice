import * as React from 'react';
import { LocaleLink } from '../locale-helpers';

import LogoImage from '../ui/logo-image/logo-image';

interface Props {
  isReverse?: boolean;
}

const Logo = ({ isReverse }: Props) => {
  return (
    <LocaleLink className="Logo" to="">
      <LogoImage isReverse={isReverse} />
    </LocaleLink>
  );
};

export default Logo;
