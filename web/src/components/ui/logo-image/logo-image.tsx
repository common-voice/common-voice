import * as React from 'react';

interface Props {
  isReverse?: boolean;
}

const LogoImage = ({ isReverse }: Props) => {
  const imageSource = isReverse
    ? require('./cv-logo-white.svg')
    : require('./cv-logo-black.svg');

  return (
    <img className="LogoImage" src={imageSource} alt="Mozilla Common Voice" />
  );
};

export default LogoImage;
