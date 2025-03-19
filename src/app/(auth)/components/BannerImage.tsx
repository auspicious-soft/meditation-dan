import Image from 'next/image';
import React from 'react';

const BannerImage = () => {
    return (
        <Image
        src="/images/auth-image.png"
        alt="Auth Image"
        width={1800}
        height={1800}
        className="  p-3 w-[100%] max-h-screen  md:min-h-full object-cover rounded-3xl"
      />
    );
}

export default BannerImage;
