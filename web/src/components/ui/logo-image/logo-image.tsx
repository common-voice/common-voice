import * as React from 'react';

interface Props {
  isReverse?: boolean;
}

const LogoImage = ({ isReverse }: Props) => {
  const imageSource = isReverse
    ? require('./cv-logo-white.svg')
    : require('./cv-logo-black.svg');

  return (
    <img className="LogoImage" src="/voicewall/img/logo-white-transparent.png" alt="Mozilla Common Voice" style={
      {
        width: "100%",
      }
    } />
  );
};

export default LogoImage;
