import Image from 'next/image';
import React from 'react';

const LogoAuth = () => {
    return (
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={162}
          height={82}
          className="md:absolute top-8 left-8"
        />
    );
}

export default LogoAuth;
