import * as React from 'react';

interface Props {
  isReverse?: boolean;
}

const LogoImage = ({ isReverse }: Props) => {
  const imageSource = isReverse
    ? require('./cv-logo-white.svg')
    : require('./cv-logo-black.svg');

  return (
    <img className="LogoImage" src="/img/logo-white-transparent.png" alt="الجدارية الصوتية" style={
      {
        width: "100%",
      }
    } />
  );
};

export default LogoImage;
