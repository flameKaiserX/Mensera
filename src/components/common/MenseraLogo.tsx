import React from 'react';
import logoImage from '../../assets/logo.png';

type MenseraLogoProps = {
  size?: number;
  className?: string;
};

export const MenseraLogo: React.FC<MenseraLogoProps> = ({ size = 40, className = '' }) => (
  <img
    src={logoImage}
    alt="Mensera flower logo"
    width={size}
    height={size}
    className={`object-contain ${className}`}
  />
);