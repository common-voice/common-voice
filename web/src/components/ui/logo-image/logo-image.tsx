import * as React from 'react';

interface Props {
  isReverse?: boolean;
}

const LogoImage = ({ isReverse }: Props) => {
  const imageSource = isReverse
    ? require('./cv-logo-white.svg')
    : require('./cv-logo-black.svg');

  return (
    <img className="LogoImage" src="https://ksaa.gov.sa/wp-content/uploads/2021/10/g705.png" alt="Mozilla Common Voice" style={
      {
        width: "200px",
      }
    } />
  );
};

export default LogoImage;
